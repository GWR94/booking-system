import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBasket, saveBasket } from '../api/basket';
import { GroupedSlot } from '../components/interfaces/SlotContext.i';
import { useSnackbar } from '../context/SnackbarContext';
import dayjs from 'dayjs';
import { HOURLY_RATE } from '../components/booking/CheckoutItem';
import { useEffect } from 'react';

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

			if (dayjs(basketData[0]?.startTime).isBefore(dayjs())) {
				// If the basket contains past slots, clear it
				console.error('Basket contains past slots, clearing...');
				saveBasket([]);
				queryClient.setQueryData(['basket'], basketData);
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
