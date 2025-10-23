import {
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	DialogActions,
	Button,
} from '@mui/material';

interface DeleteAccountDialogProps {
	dialogOpen: boolean;
	onClose: () => void;
	fullscreen: boolean;
}

const DeleteAccountDialog = ({
	dialogOpen,
	onClose,
	fullscreen,
}: DeleteAccountDialogProps) => {
	const handleDelete = () => {
		// TODO
	};

	return (
		<Dialog open={dialogOpen} fullScreen={fullscreen} onClose={onClose}>
			<DialogTitle>Delete Account?</DialogTitle>
			<DialogContent>
				<Typography>
					Are you sure you want to delete your account? This cannot be undone.
				</Typography>
				<Typography>
					This will revoke all social media connections and delete all of your
					data.
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					onClick={onClose}
					size={fullscreen ? 'small' : 'medium'}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="error"
					onClick={handleDelete}
					size={fullscreen ? 'small' : 'medium'}
				>
					Delete Account
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteAccountDialog;
