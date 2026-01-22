import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
} from '@mui/material';

type ExtendSuccessDialogProps = {
	open: boolean;
	onClose: () => void;
	successMessage: string;
};

const ExtendSuccessDialog = ({
	open,
	onClose,
	successMessage,
}: ExtendSuccessDialogProps) => {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Booking Extended Successfully</DialogTitle>
			<DialogContent>
				<Typography>{successMessage}</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} variant="contained">
					OK
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ExtendSuccessDialog;
