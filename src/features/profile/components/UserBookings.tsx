'use client';

import {
	Box,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
	IconButton,
	Tooltip,
	alpha,
	useTheme,
	Button,
	Stack,
	TablePagination,
} from '@mui/material';
import {
	Visibility as ViewIcon,
	Delete as CancelIcon,
} from '@mui/icons-material';
import React, { useState } from 'react';
import { deleteBooking } from '@api';
import { useAuth } from '@hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@context';
import dayjs from 'dayjs';
import UserBookingDetailsDialog from './UserBookingDetailsDialog';

const UserBookings = () => {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();
	const theme = useTheme();
	const [selectedBooking, setSelectedBooking] = useState<any>(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(Number(event.target.value));
		setPage(0);
	};

	const getStatusColor = (
		status: string,
	): 'success' | 'warning' | 'error' | 'default' => {
		switch (status.toLowerCase()) {
			case 'booked':
			case 'confirmed':
				return 'success';
			case 'pending':
				return 'warning';
			case 'cancelled':
				return 'error';
			default:
				return 'default';
		}
	};

	const handleCancelBooking = async (bookingId: number) => {
		try {
			await deleteBooking(bookingId);
			queryClient.invalidateQueries({ queryKey: ['auth'] });
			showSnackbar('Booking cancelled successfully', 'success');
			setDetailsOpen(false);
		} catch (error) {
			console.error(error);
			showSnackbar('Failed to cancel booking', 'error');
		}
	};

	const handleViewDetails = (booking: any) => {
		setSelectedBooking(booking);
		setDetailsOpen(true);
	};

	if (!user?.bookings || user.bookings.length === 0) {
		return (
			<Box
				sx={{
					mt: 4,
					textAlign: 'center',
					p: 8,
					bgcolor: alpha(theme.palette.primary.main, 0.02),
					borderRadius: 4,
					border: '1px dashed',
					borderColor: 'divider',
				}}
			>
				<Typography variant="h6" color="text.secondary" gutterBottom>
					No bookings found
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					Your future reservations and past sessions will appear here.
				</Typography>
				<Button variant="contained" href="/booking">
					Book Now
				</Button>
			</Box>
		);
	}

	return (
		<Box sx={{ mt: 4 }}>
			<Typography
				variant="h6"
				sx={{
					mb: 3,
					fontWeight: 700,
					display: 'flex',
					alignItems: 'center',
					gap: 1.5,
				}}
			>
				<Box
					sx={{
						width: 4,
						height: 24,
						bgcolor: 'primary.main',
						borderRadius: 1,
					}}
				/>
				My Bookings
			</Typography>

			<Paper
				elevation={0}
				sx={{
					borderRadius: 3,
					border: '1px solid',
					borderColor: 'divider',
					overflow: 'hidden',
				}}
			>
				<TableContainer>
					<Table sx={{ minWidth: 600 }}>
						<TableHead
							sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}
						>
							<TableRow>
								<TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
								<TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
								<TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
								<TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
								<TableCell align="right" sx={{ fontWeight: 600 }}>
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{[...user.bookings]
								.sort(
									(a, b) =>
										dayjs(b.bookingTime).unix() - dayjs(a.bookingTime).unix(),
								)
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((booking: any) => {
									const firstSlot = booking.slots?.[0];
									return (
										<TableRow
											key={booking.id}
											hover
											sx={{ cursor: 'pointer' }}
											onClick={() => handleViewDetails(booking)}
										>
											<TableCell>
												{firstSlot
													? dayjs(firstSlot.startTime).format('DD MMM YYYY')
													: dayjs(booking.bookingTime).format('DD MMM YYYY')}
											</TableCell>
											<TableCell>
												{firstSlot
													? dayjs(firstSlot.startTime).format('HH:mm')
													: '--:--'}
											</TableCell>
											<TableCell>
												<Chip
													label={`${booking.slots?.length || 0} Hour${booking.slots?.length !== 1 ? 's' : ''}`}
													size="small"
													variant="outlined"
												/>
											</TableCell>
											<TableCell>
												<Chip
													label={booking.status}
													color={getStatusColor(booking.status)}
													size="small"
													sx={{ textTransform: 'capitalize', fontWeight: 600 }}
												/>
											</TableCell>
											<TableCell align="right">
												<Stack
													direction="row"
													spacing={1}
													justifyContent="flex-end"
												>
													<Tooltip title="View Details">
														<IconButton
															size="small"
															onClick={(e) => {
																e.stopPropagation();
																handleViewDetails(booking);
															}}
														>
															<ViewIcon fontSize="small" />
														</IconButton>
													</Tooltip>
													{booking.status !== 'cancelled' &&
														!dayjs(
															booking.slots?.[booking.slots.length - 1]
																?.endTime,
														).isBefore(dayjs()) && (
															<Tooltip title="Cancel Booking">
																<IconButton
																	size="small"
																	color="error"
																	aria-label="Cancel Booking"
																	onClick={(e) => {
																		-e.stopPropagation();
																		-handleCancelBooking(booking.id);
																		+e.stopPropagation();
																		+handleCancelBooking(booking.id);
																	}}
																>
																	<CancelIcon fontSize="small" />
																</IconButton>
															</Tooltip>
														)}
												</Stack>
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={user.bookings.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>

			<UserBookingDetailsDialog
				booking={selectedBooking}
				open={detailsOpen}
				onClose={() => setDetailsOpen(false)}
				onCancelBooking={() => handleCancelBooking(selectedBooking?.id)}
				getStatusColor={getStatusColor}
			/>
		</Box>
	);
};

export default UserBookings;
