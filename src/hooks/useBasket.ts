'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBasket, saveBasket } from '@api';
import { useSnackbar } from '@context';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useAuth } from '@hooks';
import { usePathname } from 'next/navigation';
import { GroupedSlot } from '@features/booking/components';
import { calculateSlotPrice } from '@utils';
import { trackAddToCart } from '@utils/analytics';

export const useBasket = () => {
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();
	const pathname = usePathname();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		// Enable client-only access (localStorage) after mount to keep SSR/CSR markup consistent.
		setIsClient(true);
	}, []);

	const { data: basket = [], isFetched: isBasketFetched } = useQuery({
		queryKey: ['basket'],
		queryFn: getBasket,
		initialData: [],
		// Don't "fetch" on the server (getBasket returns [] without `window`);
		// otherwise checkout's redirect guard can fire with an empty basket.
		enabled: isClient,
	});

	useEffect(() => {
		if (!isBasketFetched) return;
		const currentPathname =
			pathname ??
			(typeof window !== 'undefined' ? window.location.pathname : '');
		const isRouteResolved = currentPathname.length > 0;
		const isCheckoutRoute = currentPathname.startsWith('/checkout');
		const shouldSkipCleanup = !isRouteResolved || isCheckoutRoute;
		if (shouldSkipCleanup) return;

		const now = dayjs();
		// Be tolerant to avoid clearing slots that are right at the boundary
		// (clock skew / user navigation delay). Using `endTime` when available
		// prevents dropping sessions that started moments ago.
		const cutoff = now.subtract(10, 'minute');

		const updatedBasket = basket.filter((item) => {
			const start = dayjs(item.startTime);
			if (!start.isValid()) return true;

			const end =
				item.endTime !== undefined ? dayjs(item.endTime) : undefined;
			if (end && end.isValid()) {
				return end.isAfter(cutoff);
			}

			// Fallback if basket entries don't contain endTime.
			return start.isAfter(cutoff);
		});

		if (updatedBasket.length !== basket.length) {
			showSnackbar(
				'Basket contains slots which have passed. Removing the slot.',
				'warning',
			);
			saveBasket(updatedBasket);
			queryClient.setQueryData(['basket'], updatedBasket);
		}
	}, [basket, isBasketFetched, pathname, queryClient, showSnackbar]);

	const addToBasketMutation = useMutation({
		mutationFn: (slot: GroupedSlot) => {
			if (basket.some((s) => s.id === slot.id)) {
				throw new Error('Slot already in basket');
			}
			if (slot.startTime.isBefore(dayjs())) {
				throw new Error('Cannot add past slots to basket');
			}
			return Promise.resolve(saveBasket([...basket, slot]));
		},
		onSuccess: (_, slot) => {
			queryClient.invalidateQueries({ queryKey: ['basket'] });
			showSnackbar(
				`Bay ${slot.bayId} • ${slot.startTime.format('h:mma')} - ${slot.endTime.format('h:mma')} added to basket`,
				'success',
			);
			const { discountedPrice } = calculateSlotPrice(
				slot.startTime,
				undefined,
				false,
			);
			const value = slot.slotIds.length * discountedPrice;
			trackAddToCart({
				value: Math.round(value * 100) / 100,
				currency: 'GBP',
				items: [{ item_id: String(slot.id), quantity: slot.slotIds.length }],
			});
		},
		onError: (error: Error) => {
			showSnackbar(error.message, 'error');
		},
	});

	const removeFromBasketMutation = useMutation({
		mutationFn: (slot: GroupedSlot) => {
			return Promise.resolve(
				saveBasket(basket.filter((s) => s.id !== slot.id)),
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['basket'] });
		},
	});

	const clearBasketMutation = useMutation({
		mutationFn: () => Promise.resolve(saveBasket([])),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['basket'] });
		},
	});

	const { user } = useAuth();
	const basketPrice = (() => {
		if (basket.length === 0) return '0.00';

		const membershipUsage = user?.membershipUsage;
		let remainingIncluded = membershipUsage?.remainingHours ?? 0;

		let total = 0;
		basket.forEach((slot) => {
			const { discountedPrice } = calculateSlotPrice(
				slot.startTime,
				user?.membershipTier,
				user?.membershipStatus === 'ACTIVE',
			);

			const slotDate = dayjs(slot.startTime);
			const isWeekend = slotDate.day() === 0 || slotDate.day() === 6;
			const isEligible =
				user?.membershipStatus === 'ACTIVE' &&
				(user.membershipTier !== 'PAR' || !isWeekend);

			const slotHours = slot.slotIds.length;
			if (isEligible && remainingIncluded > 0) {
				const freeHours = Math.min(remainingIncluded, slotHours);
				const paidHours = Math.max(0, slotHours - freeHours);
				total += paidHours * discountedPrice;
				remainingIncluded -= freeHours;
			} else {
				total += slotHours * discountedPrice;
			}
		});

		return total.toFixed(2);
	})();

	return {
		basket,
		basketPrice,
		isBasketFetched,
		addToBasket: addToBasketMutation.mutate,
		removeFromBasket: removeFromBasketMutation.mutate,
		clearBasket: clearBasketMutation.mutate,
	};
};
