import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Box,
	Stack,
	Divider,
	Chip,
	Paper,
	alpha,
	useTheme,
} from '@mui/material';
import {
	Cancel as CancelIcon,
	CheckCircle as ConfirmIcon,
	AccessTime as TimeIcon,
	Person as UserIcon,
	Info as InfoIcon,
	AddCircle as ExtendIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

type BookingDetailsDialogProps = {
	booking: any;
	open: boolean;
	onClose: () => void;
	onCancelBooking: () => void;
	onConfirmBooking: () => void;
	onExtend1Hour: () => void;
	onExtend2Hour: () => void;
	extendAvailability: {
		canExtend1Hour: boolean;
		canExtend2Hours: boolean;
	};
	isExtending: boolean;
	getStatusColor: (
		status: string,
	) => 'success' | 'warning' | 'error' | 'default';
};

const BookingDetailsDialog = ({
	booking,
	open,
	onClose,
	onCancelBooking,
	onConfirmBooking,
	onExtend1Hour,
	onExtend2Hour,
	extendAvailability,
	isExtending,
	getStatusColor,
}: BookingDetailsDialogProps) => {
	const theme = useTheme();

	if (!booking) return null;

	// Check booking status based on slot times
	const firstSlot = booking.slots?.[0];
	const lastSlot = booking.slots?.[booking.slots.length - 1];
	const now = dayjs();

	// Booking is in the past if the last slot has ended
	const isBookingInPast = lastSlot
		? dayjs(lastSlot.endTime).isBefore(now)
		: false;

	// Booking is currently active if we're between start and end time
	const isBookingActive =
		firstSlot && lastSlot
			? now.isAfter(dayjs(firstSlot.startTime)) &&
				now.isBefore(dayjs(lastSlot.endTime))
			: false;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
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
						Booking #{booking.id}
					</Typography>
					<Chip
						label={booking.status}
						color={getStatusColor(booking.status)}
						size="small"
						sx={{ textTransform: 'capitalize', fontWeight: 600 }}
					/>
				</Box>
			</DialogTitle>
			<DialogContent>
				<Stack spacing={3} sx={{ mt: 1 }}>
					{/* User Info */}
					<Box>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
							<UserIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
							<Typography variant="subtitle2" fontWeight={700}>
								Customer Details
							</Typography>
						</Box>
						<Paper
							variant="outlined"
							sx={{ p: 2, bgcolor: alpha(theme.palette.grey[500], 0.02) }}
						>
							<Typography variant="body2" fontWeight={600}>
								{booking.user?.name || 'Guest'}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{booking.user?.email}
							</Typography>
							{booking.user?.phone && (
								<Typography variant="body2" color="text.secondary">
									{booking.user.phone}
								</Typography>
							)}
						</Paper>
					</Box>

					<Divider />

					{/* Booking Info */}
					<Box>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
							<InfoIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
							<Typography variant="subtitle2" fontWeight={700}>
								Session Information
							</Typography>
						</Box>
						<Stack spacing={1}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Typography variant="body2" color="text.secondary">
									Date:
								</Typography>
								<Typography variant="body2" fontWeight={600}>
									{firstSlot
										? dayjs(firstSlot.startTime).format('dddd, DD MMMM YYYY')
										: dayjs(booking.bookingTime).format('dddd, DD MMMM YYYY')}
								</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Typography variant="body2" color="text.secondary">
									Total Duration:
								</Typography>
								<Typography variant="body2" fontWeight={600}>
									{booking.slots?.length} Hour
									{booking.slots?.length > 1 ? 's' : ''}
								</Typography>
							</Box>
						</Stack>
					</Box>

					<Divider />

					{/* Slots Breakdown */}
					<Box>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
							<TimeIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
							<Typography variant="subtitle2" fontWeight={700}>
								Slots Breakdown
							</Typography>
						</Box>
						<Stack spacing={1}>
							{booking.slots?.map((slot: any) => (
								<Paper
									key={slot.id}
									variant="outlined"
									sx={{
										p: 1.5,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<Box>
										<Typography variant="body2" fontWeight={600}>
											{slot.bay?.name || 'Bay'}
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Slot ID: {slot.id}
										</Typography>
									</Box>
									<Typography
										variant="body2"
										sx={{ color: 'primary.main', fontWeight: 600 }}
									>
										{dayjs(slot.startTime).format('HH:mm')} -{' '}
										{dayjs(slot.endTime).format('HH:mm')}
									</Typography>
								</Paper>
							))}
						</Stack>
					</Box>

					{/* Extend Booking Section - Only show for currently active bookings */}
					{isBookingActive &&
						booking.status !== 'cancelled' &&
						(extendAvailability.canExtend1Hour ||
							extendAvailability.canExtend2Hours) && (
							<>
								<Divider />
								<Box>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											mb: 1.5,
										}}
									>
										<ExtendIcon
											sx={{ mr: 1, color: 'primary.main', fontSize: 20 }}
										/>
										<Typography variant="subtitle2" fontWeight={700}>
											Extend Booking
										</Typography>
									</Box>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 2 }}
									>
										Add additional hours to this booking
									</Typography>
									<Stack direction="row" spacing={2}>
										{extendAvailability.canExtend1Hour && (
											<Button
												variant="outlined"
												startIcon={<ExtendIcon />}
												onClick={onExtend1Hour}
												disabled={isExtending}
												fullWidth
											>
												{isExtending ? 'Extending...' : 'Add 1 Hour'}
											</Button>
										)}
										{extendAvailability.canExtend2Hours && (
											<Button
												variant="outlined"
												startIcon={<ExtendIcon />}
												onClick={onExtend2Hour}
												disabled={isExtending}
												fullWidth
											>
												{isExtending ? 'Extending...' : 'Add 2 Hours'}
											</Button>
										)}
									</Stack>
								</Box>
							</>
						)}
				</Stack>
			</DialogContent>
			<DialogActions sx={{ p: 2, gap: 1 }}>
				{!isBookingInPast && booking.status !== 'cancelled' && (
					<Button
						variant="outlined"
						color="error"
						startIcon={<CancelIcon />}
						onClick={onCancelBooking}
					>
						Cancel Booking
					</Button>
				)}
				<Box sx={{ flex: 1 }} />
				<Button onClick={onClose}>Close</Button>
				{booking.status !== 'confirmed' && (
					<Button
						variant="contained"
						startIcon={<ConfirmIcon />}
						onClick={onConfirmBooking}
					>
						Confirm
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default BookingDetailsDialog;
