'use client';

import React, { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	Paper,
	Button,
	Grid2 as Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	CircularProgress,
	TablePagination,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Container,
} from '@mui/material';
import { AnimateIn, SectionHeader } from '@ui';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { blockSlots, unblockSlots, getSlots } from '@api';
import { useSnackbar } from '@context';
import {
	Block as BlockIcon,
	CheckCircle as UnblockIcon,
	Refresh as RefreshIcon,
	Warning as WarningIcon,
} from '@mui/icons-material';

const AdminBlockOuts = () => {
	const { showSnackbar } = useSnackbar();

	const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
	const [selectedBay, setSelectedBay] = useState<number | ''>('');
	const [slots, setSlots] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState<number | null>(null); // ID of slot being processed

	// Confirmation Dialog State
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [bookingConflictCount, setBookingConflictCount] = useState(0);

	// Pagination state
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(Number(event.target.value));
		setPage(0);
	};

	// Filter out past slots
	const visibleSlots = slots.filter((slot) =>
		dayjs(slot.endTime).isAfter(dayjs()),
	);

	const fetchSlots = async () => {
		if (!selectedDate) return;
		setLoading(true);
		try {
			const dateStr = selectedDate.format('YYYY-MM-DD');
			const data = await getSlots(
				dateStr,
				selectedBay === '' ? undefined : (selectedBay as number),
			);
			setSlots(data);
		} catch (error) {
			console.error(error);
			showSnackbar('Failed to load slots', 'error');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSlots();
	}, [selectedDate, selectedBay]);

	const handleOpenBlockDialog = () => {
		if (!selectedDate) return;

		// (We check visible/future slots because blocking past bookings doesn't matter)
		const conflicts = visibleSlots.filter(
			(slot) => slot.status === 'booked' || slot.status === 'confirmed',
		).length;

		setBookingConflictCount(conflicts);
		setConfirmDialogOpen(true);
	};

	const handleConfirmBlockFullDay = async () => {
		setConfirmDialogOpen(false);
		if (!selectedDate) return;

		setLoading(true);
		try {
			const startOfDay = selectedDate.startOf('day').toDate();
			const endOfDay = selectedDate.endOf('day').toDate();

			const payload = {
				startTime: startOfDay.toISOString(),
				endTime: endOfDay.toISOString(),
				bayId: selectedBay === '' ? undefined : (selectedBay as number),
			};

			const result = await blockSlots(payload);
			showSnackbar(result.message, 'success');
			await fetchSlots();
		} catch (error: any) {
			const msg = error.response?.data?.message || 'Failed to block full day';
			showSnackbar(msg, 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleToggleBlock = async (slot: any) => {
		// Determine action based on current status
		const isAvailable = slot.status === 'available';
		const isMaintenance = slot.status === 'maintenance';

		if (!isAvailable && !isMaintenance) return; // Can't toggle booked slots here

		setActionLoading(slot.id);
		try {
			const payload = {
				startTime: slot.startTime,
				endTime: slot.endTime,
				bayId: slot.bayId,
			};

			if (isAvailable) {
				await blockSlots(payload);
				showSnackbar('Slot blocked successfully', 'success');
			} else {
				await unblockSlots(payload);
				showSnackbar('Slot unblocked successfully', 'success');
			}

			// Refresh list
			await fetchSlots();
		} catch (error: any) {
			const msg = error.response?.data?.message || 'Failed to update slot';
			showSnackbar(msg, 'error');
		} finally {
			setActionLoading(null);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'available':
				return 'success';
			case 'maintenance':
				return 'error';
			case 'booked':
				return 'warning';
			default:
				return 'default';
		}
	};

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				<Box
					sx={{
						mb: 4,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Box sx={{ flex: 1 }}>
						<SectionHeader
							title="Block Out Management"
							subtitle="Admin Portal"
							description="Select a day to view and manage slot availability."
							noAnimation
							sx={{ mb: 0, textAlign: 'left', alignItems: 'flex-start' }}
						/>
					</Box>
					<Button startIcon={<RefreshIcon />} onClick={fetchSlots}>
						Refresh
					</Button>
				</Box>
				<AnimateIn type="fade-up">
					<Paper
						elevation={0}
						sx={{
							p: 4,
							borderRadius: 4,
							mb: 4,
							border: 'none',
							boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
						}}
					>
						<Grid container spacing={3} alignItems="center">
							<Grid size={{ xs: 12, md: 4 }}>
								<DatePicker
									label="Select Date"
									value={selectedDate}
									onChange={(newValue) => setSelectedDate(newValue)}
									sx={{ width: '100%' }}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<FormControl fullWidth>
									<InputLabel>Filter by Bay</InputLabel>
									<Select
										value={selectedBay}
										label="Filter by Bay"
										onChange={(e) =>
											setSelectedBay(e.target.value as number | '')
										}
									>
										<MenuItem value="">
											<em>All Bays</em>
										</MenuItem>
										<MenuItem value={1}>Bay 1</MenuItem>
										<MenuItem value={2}>Bay 2</MenuItem>
										<MenuItem value={3}>Bay 3</MenuItem>
										<MenuItem value={4}>Bay 4</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<Button
									variant="contained"
									color="error"
									fullWidth
									size="large"
									startIcon={<BlockIcon />}
									onClick={handleOpenBlockDialog}
									disabled={loading || !selectedDate}
									sx={{ height: 56 }}
								>
									Block Day
								</Button>
							</Grid>
						</Grid>
					</Paper>

					<Paper
						elevation={0}
						sx={{
							borderRadius: 4,
							overflow: 'hidden',
							border: 'none',
							boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
						}}
					>
						{loading ? (
							<Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
								<CircularProgress />
							</Box>
						) : slots.length === 0 ? (
							<Box sx={{ p: 4, textAlign: 'center' }}>
								<Typography color="text.secondary">
									No slots found for this date.
								</Typography>
							</Box>
						) : (
							<>
								<TableContainer>
									<Table>
										<TableHead sx={{ bgcolor: 'grey.50' }}>
											<TableRow>
												<TableCell>Time</TableCell>
												<TableCell>Bay</TableCell>
												<TableCell>Status</TableCell>
												<TableCell align="right">Action</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{visibleSlots
												.slice(
													page * rowsPerPage,
													page * rowsPerPage + rowsPerPage,
												)
												.map((slot) => {
													const isProcessing = actionLoading === slot.id;
													const isBooked =
														slot.status === 'booked' ||
														slot.status === 'confirmed';
													const isMaintenance = slot.status === 'maintenance';

													return (
														<TableRow key={slot.id} hover>
															<TableCell>
																<Typography fontWeight={600}>
																	{dayjs(slot.startTime).format('HH:mm')} -{' '}
																	{dayjs(slot.endTime).format('HH:mm')}
																</Typography>
															</TableCell>
															<TableCell>
																{slot.bay?.name || `Bay ${slot.bayId}`}
															</TableCell>
															<TableCell>
																<Chip
																	label={slot.status}
																	color={getStatusColor(slot.status) as any}
																	size="small"
																	sx={{ textTransform: 'capitalize' }}
																/>
															</TableCell>
															<TableCell align="right">
																{!isBooked && (
																	<Button
																		variant={
																			isMaintenance ? 'outlined' : 'contained'
																		}
																		color={isMaintenance ? 'success' : 'error'}
																		size="small"
																		disabled={isProcessing}
																		startIcon={
																			isMaintenance ? (
																				<UnblockIcon />
																			) : (
																				<BlockIcon />
																			)
																		}
																		onClick={() => handleToggleBlock(slot)}
																	>
																		{isMaintenance ? 'Unblock' : 'Block'}
																	</Button>
																)}
																{isBooked && (
																	<Typography
																		variant="caption"
																		color="text.disabled"
																	>
																		Booked
																	</Typography>
																)}
															</TableCell>
														</TableRow>
													);
												})}
										</TableBody>
									</Table>
								</TableContainer>
								<TablePagination
									rowsPerPageOptions={[10, 25, 50]}
									component="div"
									count={visibleSlots.length}
									rowsPerPage={rowsPerPage}
									page={page}
									onPageChange={handleChangePage}
									onRowsPerPageChange={handleChangeRowsPerPage}
								/>
							</>
						)}
					</Paper>
				</AnimateIn>
			</Container>

			<Dialog
				open={confirmDialogOpen}
				onClose={() => setConfirmDialogOpen(false)}
			>
				<DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					{bookingConflictCount > 0 ? (
						<>
							<WarningIcon color="warning" /> Warning: Bookings Exist
						</>
					) : (
						'Confirm Block Day'
					)}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{bookingConflictCount > 0 ? (
							<>
								There are{' '}
								<strong>{bookingConflictCount} active bookings</strong> on this
								day.
								<br />
								<br />
								Blocking the day will <strong>ONLY</strong> mark currently
								available slots as unavailable. It will <strong>NOT</strong>{' '}
								cancel existing bookings.
								<br />
								<br />
								You must manually cancel existing bookings if the facility is
								closing.
							</>
						) : (
							<>
								Are you sure you want to block all slots for{' '}
								<strong>{selectedDate?.format('dddd, DD MMMM YYYY')}</strong>
								?
								<br />
								This will mark all available slots as maintenance.
							</>
						)}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
					<Button
						onClick={handleConfirmBlockFullDay}
						variant="contained"
						color={bookingConflictCount > 0 ? 'warning' : 'primary'}
						autoFocus
					>
						Proceed Anyway
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default AdminBlockOuts;
