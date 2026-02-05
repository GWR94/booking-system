import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoredBooking, saveStoredBooking } from '@api';
import { Booking } from '@pages/booking/components';
import { useSnackbar } from '@context';

export function useBookingManager() {
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();

	// Query for current booking
	const { data: booking, isLoading } = useQuery({
		queryKey: ['booking'],
		queryFn: getStoredBooking,
		initialData: null,
	});

	// Mutation to save/update booking
	const saveBookingMutation = useMutation({
		mutationFn: (newBooking: Booking | null) =>
			Promise.resolve(saveStoredBooking(newBooking)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['booking'] });
		},
	});

	// Mutation to clear booking
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
}
