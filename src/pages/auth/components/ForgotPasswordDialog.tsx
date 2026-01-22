import { useState } from 'react';
import { requestPasswordReset } from '@api';
import { useSnackbar } from '@context';
import {
	OutlinedInput,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

interface ForgotPasswordProps {
	open: boolean;
	handleClose: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordProps> = ({
	open,
	handleClose,
}) => {
	const [loading, setLoading] = useState(false);
	const { showSnackbar } = useSnackbar();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const email = formData.get('email') as string;

		if (!email) return;

		setLoading(true);
		try {
			await requestPasswordReset(email);
			showSnackbar(
				'A password reset link has been sent if an account exists.',
				'success',
			);
			handleClose();
		} catch (error) {
			showSnackbar('Failed to send reset link. Please try again.', 'error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				component: 'form',
				onSubmit: handleSubmit,
				sx: { backgroundImage: 'none' },
			}}
		>
			<DialogTitle>Reset password</DialogTitle>
			<DialogContent
				sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
			>
				<DialogContentText>
					Enter your account&apos;s email address, and we&apos;ll send you a
					link to reset your password.
				</DialogContentText>
				<OutlinedInput
					autoFocus
					required
					margin="dense"
					id="email"
					name="email"
					label="Email address"
					placeholder="Email address"
					type="email"
					fullWidth
					disabled={loading}
				/>
			</DialogContent>
			<DialogActions sx={{ pb: 3, px: 3 }}>
				<Button onClick={handleClose} disabled={loading}>
					Cancel
				</Button>
				<LoadingButton variant="contained" type="submit" loading={loading}>
					Continue
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default ForgotPasswordDialog;
