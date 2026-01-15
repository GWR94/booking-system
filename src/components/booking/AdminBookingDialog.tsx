import {
	Button,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid2 as Grid,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { createBooking } from '@api';
import { Booking, GroupedSlot } from './types';
import dayjs from 'dayjs';

type AdminBookingDialogProps = {
	open: boolean;
	onClose: () => void;
	slots: GroupedSlot[];
	startTime: string;
	endTime: string;
};

type DialogStep = 'select' | 'confirm';

const AdminBookingDialog = ({
	open,
	onClose,
	slots,
	startTime,
	endTime,
}: AdminBookingDialogProps) => {
	const [step, setStep] = useState<DialogStep>('select');
	const [booking, setBooking] = useState<Booking | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleBookSlot = async (slot: GroupedSlot) => {
		setIsLoading(true);
		try {
			const { booking } = await createBooking(slot.slotIds);
			setBooking(booking);
			setStep('confirm');
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

	return (
		<Dialog open={open} onClose={handleClose}>
			{step === 'select' ? (
				<>
					<DialogTitle>Select a Bay</DialogTitle>
					<DialogContent>
						<DialogContentText>Pick a bay to book.</DialogContentText>
						<Grid container spacing={2} sx={{ mt: 1 }}>
							{slots.map((slot) => (
								<Grid key={slot.id}>
									<Button
										variant="outlined"
										color="primary"
										onClick={() => handleBookSlot(slot)}
										disabled={isLoading}
									>
										Bay {slot.bayId}
									</Button>
								</Grid>
							))}
						</Grid>
					</DialogContent>
				</>
			) : (
				<>
					<DialogTitle>Booking Confirmed</DialogTitle>
					<DialogContent>
						{booking && (
							<DialogContentText>
								<Typography>Your booking has been confirmed.</Typography>
								<Typography>Booking ID: {booking.id}</Typography>
								<Typography>
									Time:{' '}
									{`${dayjs(startTime).format('dddd Do MMMM HH:mma')} - ${dayjs(
										endTime,
									).format('HH:mma')}`}
								</Typography>
								<Typography>Bay: {booking.slots[0].bayId}</Typography>
							</DialogContentText>
						)}
					</DialogContent>
				</>
			)}
		</Dialog>
	);
};

export default AdminBookingDialog;
