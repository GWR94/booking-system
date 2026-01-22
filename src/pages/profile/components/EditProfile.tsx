import {
	Box,
	TextField,
	Typography,
	Button,
	useMediaQuery,
	useTheme,
	DialogTitle,
	Divider,
} from '@mui/material';
import { unlinkProvider, updateProfile } from '@api';
import { useAuth } from '@hooks';
import { useState } from 'react';
import { FacebookIcon, GoogleIcon, XIcon } from '@assets/icons/CustomIcons';
import DeleteAccountDialog from './DeleteAccountDialog';
import SubscriptionManagement from './SubscriptionManagement';
import DisconnectAccountDialog from './DisconnectAccountDialog';
import { useSnackbar } from '@context';
type EditProfileProps = {
	handleEditToggle: () => void;
};

const EditProfile = ({ handleEditToggle }: EditProfileProps) => {
	const { user } = useAuth();
	const { showSnackbar } = useSnackbar();
	const theme = useTheme();
	const fullscreen = useMediaQuery(theme.breakpoints.down('lg'));

	const [changePassword, setChangePassword] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [userState, setUserState] = useState({
		name: user?.name ?? '',
		email: user?.email ?? '',
		password: '*********',
		newPassword: '',
		confirmPassword: '',
	});
	const [disconnectProvider, setDisconnectProvider] = useState<string | null>(
		null,
	);

	const handleDisconnectClick = (provider: string) => {
		setDisconnectProvider(provider);
	};

	const handleSave = async () => {
		try {
			await updateProfile(userState);
			showSnackbar('Profile updated successfully', 'success');
			handleEditToggle();
		} catch (error) {
			showSnackbar('Failed to update profile', 'error');
			console.error('Failed to update profile', error);
		}
	};

	if (!user) return null;

	return (
		<>
			<Box>
				<Box sx={{ mb: 4 }}>
					<Typography variant="h6" fontWeight="bold">
						Edit Personal Information
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Update your name, email, and security settings.
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
					<TextField
						fullWidth
						label="Name"
						variant="outlined"
						onChange={(e) =>
							setUserState({ ...userState, name: e.target.value })
						}
						value={userState.name}
						slotProps={{ inputLabel: { shrink: true } }}
					/>
					<TextField
						fullWidth
						label="Email"
						variant="outlined"
						onChange={(e) =>
							setUserState({ ...userState, email: e.target.value })
						}
						value={userState.email}
						slotProps={{ inputLabel: { shrink: true } }}
					/>

					{user.passwordHash && (
						<Box>
							<TextField
								fullWidth
								label={changePassword ? 'Current Password' : 'Password'}
								variant="outlined"
								type="password"
								disabled={!changePassword}
								placeholder={changePassword ? '••••••••' : '••••••••'}
								sx={{ mb: changePassword ? 2 : 0 }}
								onChange={(e) =>
									setUserState({ ...userState, password: e.target.value })
								}
								value={userState.password}
								slotProps={{ inputLabel: { shrink: true } }}
							/>
							{!changePassword && (
								<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
									<Button
										size="small"
										onClick={() => {
											setChangePassword(true);
											setUserState({ ...userState, password: '' });
										}}
										sx={{ mt: 0.5, textTransform: 'none' }}
									>
										Change Password
									</Button>
								</Box>
							)}
							{changePassword && (
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										gap: 2,
										mt: 2,
									}}
								>
									<TextField
										fullWidth
										label="New Password"
										variant="outlined"
										type="password"
										placeholder="••••••••"
										onChange={(e) =>
											setUserState({
												...userState,
												newPassword: e.target.value,
											})
										}
										value={userState.newPassword}
									/>
									<TextField
										fullWidth
										label="Confirm Password"
										variant="outlined"
										type="password"
										placeholder="••••••••"
										onChange={(e) =>
											setUserState({
												...userState,
												confirmPassword: e.target.value,
											})
										}
										value={userState.confirmPassword}
									/>
								</Box>
							)}
						</Box>
					)}
				</Box>

				<Box sx={{ mt: 4, mb: 4 }}>
					<SubscriptionManagement user={user} />
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
						Social Connections
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						{/* Facebook */}
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								p: 2,
								border: '1px solid',
								borderColor: 'divider',
								borderRadius: 2,
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<FacebookIcon />
								<Typography fontWeight={500}>Facebook</Typography>
							</Box>
							{user.facebookId ? (
								<Button
									variant="outlined"
									color="error"
									size="small"
									onClick={() => handleDisconnectClick('facebook')}
									sx={{ borderRadius: 2 }}
								>
									Disconnect
								</Button>
							) : (
								<Button
									variant="outlined"
									size="small"
									href={`${
										import.meta.env.VITE_BACKEND_API
									}/api/user/login/facebook`}
									sx={{ borderRadius: 2 }}
								>
									Connect
								</Button>
							)}
						</Box>

						{/* Google */}
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								p: 2,
								border: '1px solid',
								borderColor: 'divider',
								borderRadius: 2,
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<GoogleIcon />
								<Typography fontWeight={500}>Google</Typography>
							</Box>
							{user.googleId ? (
								<Button
									variant="outlined"
									color="error"
									size="small"
									onClick={() => handleDisconnectClick('google')}
									sx={{ borderRadius: 2 }}
								>
									Disconnect
								</Button>
							) : (
								<Button
									variant="outlined"
									size="small"
									href={`${
										import.meta.env.VITE_BACKEND_API
									}/api/user/login/google`}
									sx={{ borderRadius: 2 }}
								>
									Connect
								</Button>
							)}
						</Box>

						{/* Twitter */}
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								p: 2,
								border: '1px solid',
								borderColor: 'divider',
								borderRadius: 2,
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<XIcon />
								<Typography fontWeight={500}>X (Twitter)</Typography>
							</Box>
							{user.twitterId ? (
								<Button
									variant="outlined"
									color="error"
									size="small"
									onClick={() => handleDisconnectClick('twitter')}
									sx={{ borderRadius: 2 }}
								>
									Disconnect
								</Button>
							) : (
								<Button
									variant="outlined"
									size="small"
									href={`${
										import.meta.env.VITE_BACKEND_API
									}/api/user/login/twitter`}
									sx={{ borderRadius: 2 }}
								>
									Connect
								</Button>
							)}
						</Box>
					</Box>
				</Box>

				<Divider sx={{ my: 4 }} />

				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					}}
				>
					<Button
						variant="text"
						color="error"
						onClick={() => setDialogOpen(true)}
						sx={{ textTransform: 'none' }}
					>
						Delete Account
					</Button>

					<Box sx={{ display: 'flex', gap: 2 }}>
						<Button
							variant="outlined"
							color="secondary"
							onClick={handleEditToggle}
							sx={{ borderRadius: 2 }}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={handleSave}
							sx={{ borderRadius: 2, px: 4 }}
						>
							Save Changes
						</Button>
					</Box>
				</Box>
			</Box>
			<DeleteAccountDialog
				dialogOpen={dialogOpen}
				onClose={() => setDialogOpen(false)}
				fullscreen={fullscreen}
			/>
			<DisconnectAccountDialog
				open={!!disconnectProvider}
				provider={disconnectProvider}
				onClose={() => setDisconnectProvider(null)}
			/>
		</>
	);
};

export default EditProfile;
