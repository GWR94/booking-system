import { Button, Container } from '@mui/material';
import dayjs from 'dayjs';
import { iSlot } from '../interfaces/Booking.i';

type SlotProps = {
	slot: iSlot;
	handleBooking: (slots: number[]) => void;
};

// TODO
// [ ] set unavailable if time already gone

const Slot = ({ slot, handleBooking }: SlotProps) => {
	return (
		<Container sx={{ my: 1 }}>
			<Button
				onClick={() => handleBooking(slot.slots)}
				disabled={slot.status !== 'available'}
				key={slot.id}
				variant="contained"
				fullWidth
			>
				{dayjs(slot.startTime).format('HH:mm')} -{' '}
				{dayjs(slot.endTime).format('HH:mm')} ({slot.status})
			</Button>
		</Container>
	);
};

export default Slot;
