import {
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	DialogActions,
	Button,
} from '@mui/material';
import { deleteAccount } from '@api';
import { useAuth } from '@hooks';
import { useSnackbar } from '@context';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
	const { logout } = useAuth();
	const { showSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		setLoading(true);
		try {
			await deleteAccount();
			await logout();
			showSnackbar('Account deleted successfully', 'success');
			navigate('/');
		} catch (error) {
			console.error('Error deleting account:', error);
			showSnackbar('Failed to delete account', 'error');
		} finally {
			setLoading(false);
			onClose();
		}
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
					disabled={loading}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="error"
					onClick={handleDelete}
					size={fullscreen ? 'small' : 'medium'}
					disabled={loading}
				>
					{loading ? 'Deleting...' : 'Delete Account'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteAccountDialog;
