import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBasket, saveBasket } from '@api';
import { useSnackbar } from '@context';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { GroupedSlot } from '@components/booking';
import { HOURLY_RATE } from '@components/checkout';

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
			if (updatedBasket.length !== basket.length) {
				showSnackbar(
					'Basket contains slots which have passed. Removing the slot.',
					'warning',
				);
				saveBasket(updatedBasket);
				queryClient.setQueryData(['basket'], updatedBasket);
			}
		};

		fetchBasket();
	}, [queryClient]);

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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['basket'] });
			showSnackbar('Added to basket', 'success');
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

	const basketPrice = basket
		.reduce((acc, slot) => acc + slot.slotIds.length * (HOURLY_RATE / 100), 0)
		.toFixed(2);

	return {
		basket,
		basketPrice,
		addToBasket: addToBasketMutation.mutate,
		removeFromBasket: removeFromBasketMutation.mutate,
		clearBasket: clearBasketMutation.mutate,
	};
}
