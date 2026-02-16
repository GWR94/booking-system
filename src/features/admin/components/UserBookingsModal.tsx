'use client';

import {
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	Box,
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
	TablePagination,
} from '@mui/material';
import {
	Visibility as ViewIcon,
	Close as CloseIcon,
} from '@mui/icons-material';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import UserBookingDetailsDialog from '@features/profile/components/UserBookingDetailsDialog';
import { adminDeleteBooking } from '@api';
import { useSnackbar } from '@context';

type UserBookingsModalProps = {
	user: any;
	open: boolean;
	onClose: () => void;
};

const UserBookingsModal = ({ user, open, onClose }: UserBookingsModalProps) => {
	const theme = useTheme();
	const [selectedBooking, setSelectedBooking] = useState<any>(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const { showSnackbar } = useSnackbar();

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
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

	const handleViewDetails = (booking: any) => {
		setSelectedBooking(booking);
		setDetailsOpen(true);
	};

	const handleCancelBooking = async (bookingId: number) => {
		try {
			await adminDeleteBooking(bookingId);
			showSnackbar('Booking cancelled successfully', 'success');
			setDetailsOpen(false);
			onClose();
		} catch (error) {
			console.error(error);
			showSnackbar('Failed to cancel booking', 'error');
		}
	};

	if (!user) return null;

	return (
		<>
			<Dialog
				open={open}
				onClose={onClose}
				maxWidth="md"
				fullWidth
				PaperProps={{
					sx: { borderRadius: 3, p: 1 },
				}}
			>
				<DialogTitle sx={{ pb: 1 }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Typography variant="h6" fontWeight={700}>
							{user.name}'s Bookings
						</Typography>
						<IconButton onClick={onClose} size="small" aria-label="close">
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					{!user.bookings || user.bookings.length === 0 ? (
						<Box sx={{ textAlign: 'center', py: 4 }}>
							<Typography variant="body2" color="text.secondary">
								No bookings found for this user.
							</Typography>
						</Box>
					) : (
						<TableContainer
							component={Paper}
							variant="outlined"
							sx={{ mt: 1, borderRadius: 2 }}
						>
							<Table size="small">
								<TableHead
									sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}
								>
									<TableRow>
										<TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Bays</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
										<TableCell align="right" sx={{ fontWeight: 600 }}>
											Actions
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{[...user.bookings]
										.sort(
											(a: any, b: any) =>
												dayjs(b.bookingTime).unix() -
												dayjs(a.bookingTime).unix(),
										)
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((booking: any) => {
											const firstSlot = booking.slots?.[0];
											const lastSlot =
												booking.slots?.[booking.slots.length - 1];

											const bayNames = Array.from(
												new Set(
													booking.slots?.map((s: any) => `Bay ${s.bayId}`) ||
														[],
												),
											).join(', ');

											return (
												<TableRow
													key={booking.id}
													hover
													sx={{ cursor: 'pointer' }}
													onClick={() => handleViewDetails(booking)}
												>
													<TableCell>{booking.id}</TableCell>
													<TableCell>
														{firstSlot
															? dayjs(firstSlot.startTime).format('DD/MM/YYYY')
															: dayjs(booking.bookingTime).format('DD/MM/YYYY')}
													</TableCell>
													<TableCell>
														{firstSlot
															? `${dayjs(firstSlot.startTime).format('HH:mm')} - ${dayjs(lastSlot.endTime).format('HH:mm')}`
															: '--:--'}
													</TableCell>
													<TableCell>
														<Typography
															variant="caption"
															sx={{ fontWeight: 500 }}
														>
															{bayNames ||
																`${booking.slots?.length || 0} Slots`}
														</Typography>
													</TableCell>
													<TableCell>
														<Chip
															label={booking.status}
															color={getStatusColor(booking.status)}
															size="small"
															sx={{
																textTransform: 'capitalize',
																fontWeight: 600,
																height: 20,
																fontSize: '0.7rem',
															}}
														/>
													</TableCell>
													<TableCell align="right">
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
													</TableCell>
												</TableRow>
											);
										})}
								</TableBody>
							</Table>
						</TableContainer>
					)}
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={user.bookings?.length || 0}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</DialogContent>
			</Dialog>

			<UserBookingDetailsDialog
				booking={selectedBooking}
				open={detailsOpen}
				onClose={() => setDetailsOpen(false)}
				onCancelBooking={handleCancelBooking}
				getStatusColor={getStatusColor}
			/>
		</>
	);
};

export default UserBookingsModal;
