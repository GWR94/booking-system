import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { unlinkProvider } from '@api';
import { useState } from 'react';

type Props = {
	open: boolean;
	onClose: () => void;
	provider: string | null;
};

const DisconnectAccountDialog = ({ open, onClose, provider }: Props) => {
	const [error, seterror] = useState<string | null>(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

	const handleConfirmDisconnect = async () => {
		if (!provider) return;
		try {
			await unlinkProvider(provider);
			onClose();
		} catch (error: any) {
			console.log('Disconnect Error:', error);
			if (error.response) {
				console.log('Error Response:', error.response);
			}
			seterror(error.response?.data?.message || 'Failed to disconnect account');
		}
	};

	const handleClose = () => {
		seterror(null);
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} fullScreen={isMobile}>
			<DialogTitle>Disconnect Account?</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Are you sure you want to disconnect {provider}?
					{error && (
						<Typography
							color="error"
							sx={{ mt: 2, display: 'block', fontStyle: 'italic' }}
						>
							{error}
						</Typography>
					)}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleConfirmDisconnect} color="error" autoFocus>
					Disconnect
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DisconnectAccountDialog;
