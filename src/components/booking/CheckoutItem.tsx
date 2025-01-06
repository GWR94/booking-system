import { Box, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { useSlots } from '../../context/SlotContext';
import { GroupedSlot } from '../interfaces/SlotContext.i';

type CheckoutItemProps = {
	slot: GroupedSlot;
	proceedToPayment: () => void;
};

const HOURLY_RATE = 4500;

const CheckoutItem: React.FC<CheckoutItemProps> = ({
	slot,
	proceedToPayment,
}) => {
	const { removeFromBasket, selectedDate } = useSlots();
	return (
		<Box sx={{ mb: 3 }}>
			<Typography variant="body1" gutterBottom>
				Date: <strong>{selectedDate.format('dddd Do MMM YYYY')}</strong>
			</Typography>
			<Typography variant="body1" gutterBottom>
				Time:{' '}
				<strong>
					{dayjs(slot.startTime).format('h:mma')} -{' '}
					{dayjs(slot.endTime).format('h:mma')}
				</strong>
			</Typography>
			<Typography variant="body1" gutterBottom>
				Bay: <strong>{slot.bayId}</strong>
			</Typography>
			<Typography variant="body1" gutterBottom>
				Price:{' '}
				<strong>
					£{((HOURLY_RATE / 100) * slot.slotIds.length).toFixed(2)}
				</strong>
			</Typography>
			<Button variant="text" onClick={() => removeFromBasket(slot)}>
				Remove
			</Button>
			<Button
				variant="contained"
				color="primary"
				fullWidth
				onClick={proceedToPayment}
			>
				Proceed to Payment
			</Button>
		</Box>
	);
};

export default CheckoutItem;
