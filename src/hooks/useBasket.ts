import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBasket, saveBasket } from '@api';
import { useSnackbar } from '@context';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useAuth } from '@hooks';
import { GroupedSlot } from '@pages/booking/components';
import { calculateSlotPrice } from '@utils';

export function useBasket() {
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();

	const { data: basket = [] } = useQuery({
		queryKey: ['basket'],
		queryFn: getBasket,
		initialData: [],
	});

	useEffect(() => {
		const fetchBasket = () => {
			const basketData = getBasket();
			const updatedBasket = basketData.filter((item) =>
				dayjs(item.startTime).isAfter(dayjs()),
			);
			if (updatedBasket.length !== basketData.length) {
				showSnackbar(
					'Basket contains slots which have passed. Removing the slot.',
					'warning',
				);
				saveBasket(updatedBasket);
				queryClient.setQueryData(['basket'], updatedBasket);
			}
		};

		fetchBasket();
	}, [basket, queryClient, showSnackbar]);

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
		onSuccess: (_, { startTime, endTime, bayId }) => {
			queryClient.invalidateQueries({ queryKey: ['basket'] });
			showSnackbar(
				`Bay ${bayId} • ${startTime.format('h:mma')} - ${endTime.format('h:mma')} added to basket`,
				'success',
			);
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
		addToBasket: addToBasketMutation.mutate,
		removeFromBasket: removeFromBasketMutation.mutate,
		clearBasket: clearBasketMutation.mutate,
	};
}
