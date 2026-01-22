import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
	Box,
	Stack,
	IconButton,
	useTheme,
	alpha,
} from '@mui/material';
import {
	CalendarToday,
	AccessTime,
	SportsGolf,
	CheckCircle,
	Close,
} from '@mui/icons-material';
import { useState } from 'react';
import { createAdminBooking } from '@api';
import { Booking, GroupedSlot } from './types';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

type AdminBookingDialogProps = {
	open: boolean;
	onClose: () => void;
	slot: GroupedSlot;
	startTime: string;
	endTime: string;
};

type DialogStep = 'select' | 'confirm';

const AdminBookingDialog = ({
	open,
	onClose,
	slot,
}: AdminBookingDialogProps) => {
	const theme = useTheme();
	const queryClient = useQueryClient();
	const [step, setStep] = useState<DialogStep>('select');
	const [booking, setBooking] = useState<Booking | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleBookSlot = async (slot: GroupedSlot) => {
		setIsLoading(true);
		try {
			const { booking } = await createAdminBooking(slot.slotIds);
			setBooking(booking);
			setStep('confirm');
			// Invalidate slots query to refresh the UI immediately
			queryClient.invalidateQueries({ queryKey: ['slots'] });
		} catch (error) {
			console.error('Error booking slot:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setStep('select');
		setBooking(null);
		onClose();
	};

	const DetailRow = ({
		icon,
		label,
		value,
	}: {
		icon: React.ReactNode;
		label: string;
		value: string;
	}) => (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
			<Box
				sx={{
					color: 'primary.main',
					bgcolor: alpha(theme.palette.primary.main, 0.1),
					p: 1,
					borderRadius: 2,
					display: 'flex',
				}}
			>
				{icon}
			</Box>
			<Box>
				<Typography variant="caption" color="text.secondary" display="block">
					{label}
				</Typography>
				<Typography variant="body1" fontWeight={600}>
					{value}
				</Typography>
			</Box>
		</Box>
	);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 3,
					overflow: 'hidden',
				},
			}}
		>
			<DialogTitle
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					bgcolor: 'background.default',
					borderBottom: `1px solid ${theme.palette.divider}`,
					pb: 2,
				}}
			>
				<Typography variant="h6" fontWeight={700}>
					{step === 'select' ? 'Confirm Admin Booking' : 'Booking Successful'}
				</Typography>
				<IconButton onClick={handleClose} size="small">
					<Close />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ mt: 2 }}>
				{step === 'select' ? (
					<Stack spacing={3}>
						<Typography variant="body1" color="text.secondary">
							You are about to create an admin booking for this slot. Please
							confirm the details below.
						</Typography>

						<Stack
							spacing={2}
							sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}
						>
							<DetailRow
								icon={<CalendarToday />}
								label="Date"
								value={dayjs(slot.startTime).format('dddd Do MMMM YYYY')}
							/>
							<DetailRow
								icon={<AccessTime />}
								label="Time"
								value={`${dayjs(slot.startTime).format('HH:mm')} - ${dayjs(
									slot.endTime,
								).format('HH:mm')}`}
							/>
							<DetailRow
								icon={<SportsGolf />}
								label="Bay Details"
								value={`Bay ${slot.bayId}`}
							/>
						</Stack>
					</Stack>
				) : (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							textAlign: 'center',
							py: 3,
						}}
					>
						<CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
						<Typography variant="h5" gutterBottom fontWeight={700}>
							Booking Confirmed!
						</Typography>
						<Typography color="text.secondary" paragraph>
							The booking has been successfully created.
						</Typography>

						{booking && (
							<Stack
								spacing={2}
								sx={{
									mt: 2,
									width: '100%',
									p: 2,
									bgcolor: alpha(theme.palette.success.main, 0.05),
									border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
									borderRadius: 2,
								}}
							>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<Typography variant="subtitle2" color="text.secondary">
										Booking ID
									</Typography>
									<Typography variant="subtitle2" fontWeight={700}>
										{booking.id}
									</Typography>
								</Box>
							</Stack>
						)}
					</Box>
				)}
			</DialogContent>

			<DialogActions sx={{ p: 3, pt: 0 }}>
				{step === 'select' ? (
					<>
						<Button
							onClick={handleClose}
							variant="outlined"
							color="inherit"
							sx={{ borderRadius: 2 }}
						>
							Cancel
						</Button>
						<Button
							onClick={() => handleBookSlot(slot)}
							disabled={isLoading}
							variant="contained"
							disableElevation
							sx={{ borderRadius: 2, px: 4 }}
						>
							{isLoading ? 'Booking...' : 'Confirm Booking'}
						</Button>
					</>
				) : (
					<Button
						onClick={handleClose}
						variant="contained"
						fullWidth
						disableElevation
						sx={{ borderRadius: 2 }}
					>
						Done
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default AdminBookingDialog;
