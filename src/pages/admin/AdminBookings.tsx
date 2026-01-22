import { useAdminBookings } from './hooks/useAdminBookings';
import { adminCheckExtendAvailability } from '@api';
import { Box } from '@mui/material';
import { LoadingSpinner } from '@ui';
import { useState, useEffect } from 'react';
import {
	BookingsTable,
	BookingDetailsDialog,
	CancelBookingDialog,
	ExtendErrorDialog,
	ExtendSuccessDialog,
} from './components';

const AdminBookings = () => {
	const [selectedBooking, setSelectedBooking] = useState<any>(null);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
	const [isExtendErrorOpen, setIsExtendErrorOpen] = useState(false);
	const [isExtendSuccessOpen, setIsExtendSuccessOpen] = useState(false);
	const [extendErrorMessage, setExtendErrorMessage] = useState('');
	const [extendSuccessMessage, setExtendSuccessMessage] = useState('');
	const [extendAvailability, setExtendAvailability] = useState<{
		canExtend1Hour: boolean;
		canExtend2Hours: boolean;
	}>({ canExtend1Hour: false, canExtend2Hours: false });

	const {
		bookings,
		totalBookings,
		page,
		setPage,
		rowsPerPage,
		setRowsPerPage,
		search,
		setSearch,
		isLoadingBookings: isLoading,
		updateStatus,
		deleteBooking,
		extendBooking,
		isExtending,
		extendError,
	} = useAdminBookings();

	// Handle extend booking errors
	useEffect(() => {
		if (extendError) {
			const error = extendError as any;
			const message =
				error.response?.data?.message || 'Failed to extend booking';
			setExtendErrorMessage(message);
			setIsExtendErrorOpen(true);
		}
	}, [extendError]);

	// Check slot availability when booking is selected
	useEffect(() => {
		if (selectedBooking?.id) {
			adminCheckExtendAvailability(selectedBooking.id)
				.then((data) => {
					setExtendAvailability(data);
				})
				.catch(() => {
					setExtendAvailability({
						canExtend1Hour: false,
						canExtend2Hours: false,
					});
				});
		}
	}, [selectedBooking?.id]);

	if (isLoading) return <LoadingSpinner />;

	const handleOpenDetails = (booking: any) => {
		setSelectedBooking(booking);
		setIsDetailsOpen(true);
	};

	const getStatusColor = (
		status: string,
	): 'success' | 'warning' | 'error' | 'default' => {
		switch (status.toLowerCase()) {
			case 'confirmed':
			case 'confirmed - local':
				return 'success';
			case 'pending':
				return 'warning';
			case 'cancelled':
				return 'error';
			default:
				return 'default';
		}
	};

	const handleCancelBooking = () => {
		if (selectedBooking) {
			deleteBooking(selectedBooking.id, {
				onSuccess: () => {
					setIsDetailsOpen(false);
					setIsCancelConfirmOpen(false);
				},
			});
		}
	};

	const handleConfirmBooking = () => {
		updateStatus({
			id: selectedBooking.id,
			status: 'confirmed',
		});
	};

	const handleExtend1Hour = () => {
		extendBooking(
			{
				id: selectedBooking.id,
				hours: 1,
			},
			{
				onSuccess: (data) => {
					setIsDetailsOpen(false);
					setExtendSuccessMessage(
						data.message || 'Booking extended by 1 hour successfully',
					);
					setIsExtendSuccessOpen(true);
				},
			},
		);
	};

	const handleExtend2Hours = () => {
		extendBooking(
			{
				id: selectedBooking.id,
				hours: 2,
			},
			{
				onSuccess: (data) => {
					setIsDetailsOpen(false);
					setExtendSuccessMessage(
						data.message || 'Booking extended by 2 hours successfully',
					);
					setIsExtendSuccessOpen(true);
				},
			},
		);
	};

	return (
		<Box>
			<BookingsTable
				bookings={bookings}
				totalBookings={totalBookings}
				page={page}
				rowsPerPage={rowsPerPage}
				search={search}
				onPageChange={setPage}
				onRowsPerPageChange={setRowsPerPage}
				onSearchChange={setSearch}
				onViewDetails={handleOpenDetails}
				getStatusColor={getStatusColor}
			/>

			<BookingDetailsDialog
				booking={selectedBooking}
				open={isDetailsOpen}
				onClose={() => setIsDetailsOpen(false)}
				onCancelBooking={() => setIsCancelConfirmOpen(true)}
				onConfirmBooking={handleConfirmBooking}
				onExtend1Hour={handleExtend1Hour}
				onExtend2Hour={handleExtend2Hours}
				extendAvailability={extendAvailability}
				isExtending={isExtending}
				getStatusColor={getStatusColor}
			/>

			<CancelBookingDialog
				open={isCancelConfirmOpen}
				onClose={() => setIsCancelConfirmOpen(false)}
				onConfirm={handleCancelBooking}
			/>

			<ExtendErrorDialog
				open={isExtendErrorOpen}
				onClose={() => setIsExtendErrorOpen(false)}
				errorMessage={extendErrorMessage}
			/>

			<ExtendSuccessDialog
				open={isExtendSuccessOpen}
				onClose={() => setIsExtendSuccessOpen(false)}
				successMessage={extendSuccessMessage}
			/>
		</Box>
	);
};

export default AdminBookings;
