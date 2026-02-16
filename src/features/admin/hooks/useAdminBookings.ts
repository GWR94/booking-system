'use client';

import { useState, useEffect } from 'react';
import {
	useQuery,
	useMutation,
	useQueryClient,
	keepPreviousData,
} from '@tanstack/react-query';
import {
	getAllBookings,
	adminUpdateBookingStatus,
	adminDeleteBooking,
	adminExtendBooking,
} from '@api';
import { useSnackbar } from '@context';

export const useAdminBookings = () => {
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 500);
		return () => clearTimeout(timer);
	}, [search]);

	// Reset page to 0 when search changes
	useEffect(() => {
		setPage(0);
	}, [debouncedSearch]);

	const { data: bookingsData, isLoading: isLoadingBookings } = useQuery({
		queryKey: ['adminBookings', page, rowsPerPage, debouncedSearch],
		queryFn: () =>
			getAllBookings({
				page: page + 1,
				limit: rowsPerPage,
				search: debouncedSearch,
			}),
		placeholderData: keepPreviousData,
	});

	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }: { id: number; status: string }) =>
			adminUpdateBookingStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
			showSnackbar('Booking status updated', 'success');
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => adminDeleteBooking(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
			showSnackbar('Booking cancelled and slots freed', 'success');
		},
	});

	const extendMutation = useMutation({
		mutationFn: ({ id, hours }: { id: number; hours: 1 | 2 }) =>
			adminExtendBooking(id, hours),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
		},
		// Error handling will be done at component level with a dialog
	});

	return {
		bookings: bookingsData?.data || [],
		totalBookings: bookingsData?.pagination?.total || 0,
		page,
		setPage,
		rowsPerPage,
		setRowsPerPage,
		search,
		setSearch,
		isLoadingBookings,
		updateStatus: updateStatusMutation.mutate,
		isUpdating: updateStatusMutation.isPending,
		deleteBooking: deleteMutation.mutate,
		isDeleting: deleteMutation.isPending,
		extendBooking: extendMutation.mutate,
		isExtending: extendMutation.isPending,
		extendError: extendMutation.error,
	};
};
