import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
} from '@mui/material';

type ExtendErrorDialogProps = {
	open: boolean;
	onClose: () => void;
	errorMessage: string;
};

const ExtendErrorDialog = ({
	open,
	onClose,
	errorMessage,
}: ExtendErrorDialogProps) => {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Unable to Extend Booking</DialogTitle>
			<DialogContent>
				<Typography>{errorMessage}</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} variant="contained">
					OK
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ExtendErrorDialog;
