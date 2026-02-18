'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoredBooking, saveStoredBooking } from '@api';
import { Booking } from '@features/booking/components';
import { useSnackbar } from '@context';

export const useBookingManager = () => {
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();

	const { data: booking, isLoading } = useQuery({
		queryKey: ['booking'],
		queryFn: getStoredBooking,
		initialData: null,
	});

	const saveBookingMutation = useMutation({
		mutationFn: (newBooking: Booking | null) =>
			Promise.resolve(saveStoredBooking(newBooking)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['booking'] });
		},
	});

	const clearBookingMutation = useMutation({
		mutationFn: () => Promise.resolve(saveStoredBooking(null)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['booking'] });
			showSnackbar('Booking cleared', 'success');
		},
	});

	return {
		booking,
		setBooking: saveBookingMutation.mutate,
		clearBooking: clearBookingMutation.mutate,
		isLoading,
	};
};
