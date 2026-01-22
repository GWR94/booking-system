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
	AccessTime as TimeIcon,
	Info as InfoIcon,
	LocationOn as LocationIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

type UserBookingDetailsDialogProps = {
	booking: any;
	open: boolean;
	onClose: () => void;
	onCancelBooking: () => void;
	getStatusColor: (
		status: string,
	) => 'success' | 'warning' | 'error' | 'default';
};

const UserBookingDetailsDialog = ({
	booking,
	open,
	onClose,
	onCancelBooking,
	getStatusColor,
}: UserBookingDetailsDialogProps) => {
	const theme = useTheme();

	if (!booking) return null;

	const firstSlot = booking.slots?.[0];
	const lastSlot = booking.slots?.[booking.slots.length - 1];
	const now = dayjs();

	const isBookingInPast = lastSlot
		? dayjs(lastSlot.endTime).isBefore(now)
		: false;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="xs"
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
						Booking Details
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
					{/* Session Info */}
					<Box>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
							<InfoIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
							<Typography variant="subtitle2" fontWeight={700}>
								Session Information
							</Typography>
						</Box>
						<Paper
							variant="outlined"
							sx={{ p: 2, bgcolor: alpha(theme.palette.grey[500], 0.02) }}
						>
							<Stack spacing={1}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography variant="body2" color="text.secondary">
										Date
									</Typography>
									<Typography variant="body2" fontWeight={600}>
										{firstSlot
											? dayjs(firstSlot.startTime).format('dddd, DD MMMM YYYY')
											: dayjs(booking.bookingTime).format('dddd, DD MMMM YYYY')}
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography variant="body2" color="text.secondary">
										Time
									</Typography>
									<Typography variant="body2" fontWeight={600}>
										{firstSlot
											? dayjs(firstSlot.startTime).format('HH:mm')
											: ''}{' '}
										- {lastSlot ? dayjs(lastSlot.endTime).format('HH:mm') : ''}
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography variant="body2" color="text.secondary">
										Duration
									</Typography>
									<Typography variant="body2" fontWeight={600}>
										{booking.slots?.length} Hour
										{booking.slots?.length > 1 ? 's' : ''}
									</Typography>
								</Box>
							</Stack>
						</Paper>
					</Box>

					<Divider />

					{/* Slots / Bays */}
					<Box>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
							<LocationIcon
								sx={{ mr: 1, color: 'primary.main', fontSize: 20 }}
							/>
							<Typography variant="subtitle2" fontWeight={700}>
								Bay Selection
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
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<TimeIcon
											sx={{ mr: 1.5, fontSize: 18, color: 'text.secondary' }}
										/>
										<Typography variant="body2" fontWeight={600}>
											{dayjs(slot.startTime).format('HH:mm')} -{' '}
											{dayjs(slot.endTime).format('HH:mm')}
										</Typography>
									</Box>
									<Chip
										label={slot.bay?.name || `Bay ${slot.bayId}`}
										size="small"
										variant="outlined"
										sx={{ fontWeight: 600 }}
									/>
								</Paper>
							))}
						</Stack>
					</Box>
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
				<Button onClick={onClose} variant="contained">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default UserBookingDetailsDialog;
