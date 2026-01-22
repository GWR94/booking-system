import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
} from '@mui/material';

type CancelBookingDialogProps = {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
};

const CancelBookingDialog = ({
	open,
	onClose,
	onConfirm,
}: CancelBookingDialogProps) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Cancel Booking?</DialogTitle>
			<DialogContent>
				<Typography>
					Are you sure you want to cancel this booking and free up the slots?
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Keep Booking</Button>
				<Button color="error" variant="contained" onClick={onConfirm}>
					Yes, Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CancelBookingDialog;
