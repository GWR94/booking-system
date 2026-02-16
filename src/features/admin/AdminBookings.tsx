'use client';

import { useAdminBookings } from './hooks/useAdminBookings';
import { adminCheckExtendAvailability } from '@api';
import {
	Box,
	Paper,
	Typography,
	useTheme,
	alpha,
	Container,
} from '@mui/material';
import { LoadingSpinner, AnimateIn, SectionHeader } from '@ui';
import { useState, useEffect } from 'react';
import { BookingsTable, BookingDetailsDialog, AdminDialog } from './components';

const AdminBookings = () => {
	const theme = useTheme();
	const [selectedBooking, setSelectedBooking] = useState<any>(null);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [dialogConfig, setDialogConfig] = useState<{
		open: boolean;
		title: string;
		description: string;
		type: 'success' | 'error' | 'confirm' | 'info';
		onConfirm?: () => void;
	}>({
		open: false,
		title: '',
		description: '',
		type: 'info',
	});
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
			setDialogConfig({
				open: true,
				title: 'Unable to Extend Booking',
				description: message,
				type: 'error',
			});
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
					setDialogConfig({ ...dialogConfig, open: false });
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
					setDialogConfig({
						open: true,
						title: 'Booking Extended Successfully',
						description:
							data.message || 'Booking extended by 1 hour successfully',
						type: 'success',
					});
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
					setDialogConfig({
						open: true,
						title: 'Booking Extended Successfully',
						description:
							data.message || 'Booking extended by 2 hours successfully',
						type: 'success',
					});
				},
			},
		);
	};

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="xl">
				<SectionHeader
					title="Bookings Management"
					subtitle="Admin Portal"
					description="View and manage all simulator reservations"
					noAnimation
				/>
				<AnimateIn type="fade-up">
					<Paper
						elevation={0}
						sx={{
							borderRadius: 4,
							border: 'none',
							boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
							overflow: 'hidden',
						}}
					>
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
					</Paper>
				</AnimateIn>
			</Container>

			<BookingDetailsDialog
				booking={selectedBooking}
				open={isDetailsOpen}
				onClose={() => setIsDetailsOpen(false)}
				onCancelBooking={() =>
					setDialogConfig({
						open: true,
						title: 'Cancel Booking?',
						description:
							'Are you sure you want to cancel this booking and free up the slots?',
						type: 'confirm',
						onConfirm: handleCancelBooking,
					})
				}
				onConfirmBooking={handleConfirmBooking}
				onExtend1Hour={handleExtend1Hour}
				onExtend2Hour={handleExtend2Hours}
				extendAvailability={extendAvailability}
				isExtending={isExtending}
				getStatusColor={getStatusColor}
			/>

			<AdminDialog
				{...dialogConfig}
				onClose={() => setDialogConfig({ ...dialogConfig, open: false })}
			/>
		</Box>
	);
};

export default AdminBookings;
