import {
	Box,
	TextField,
	Typography,
	Button,
	useMediaQuery,
	useTheme,
	DialogTitle,
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
		} catch (error) {
			showSnackbar('Failed to update profile', 'error');
			console.error('Failed to update profile', error);
		}
	};

	if (!user) return null;

	return (
		<>
			<Box>
				<TextField
					fullWidth
					label="Name"
					variant="outlined"
					sx={{ mb: 2 }}
					onChange={(e) => setUserState({ ...userState, name: e.target.value })}
					value={userState.name}
				/>
				<TextField
					fullWidth
					label="Email"
					variant="outlined"
					onChange={(e) =>
						setUserState({ ...userState, email: e.target.value })
					}
					sx={{ mb: 2 }}
					value={userState.email}
				/>
				{user.passwordHash && (
					<>
						<TextField
							fullWidth
							label={changePassword ? 'Current Password' : 'Password'}
							variant="outlined"
							type="password"
							disabled={!changePassword}
							placeholder={
								changePassword ? 'Click to change' : 'Click to change'
							}
							sx={{ mb: changePassword ? 2 : 0 }}
							onChange={(e) =>
								setUserState({ ...userState, password: e.target.value })
							}
							value={userState.password}
						/>
						{!changePassword && (
							<Box
								sx={{
									display: 'flex',
									width: '100%',
									justifyContent: 'flex-end',
								}}
							>
								<Typography
									sx={{
										fontSize: '12px',
										color: 'blue',
										cursor: 'pointer',
										mt: 1,
										'&:hover': { color: 'black' },
									}}
									onClick={() => {
										setChangePassword(true);
										setUserState({ ...userState, password: '' });
									}}
								>
									Change Password
								</Typography>
							</Box>
						)}
						{changePassword && (
							<>
								<TextField
									fullWidth
									label="New Password"
									variant="outlined"
									type="password"
									placeholder="********"
									sx={{ mb: 2 }}
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
									sx={{ mb: 2 }}
									type="password"
									placeholder="********"
									onChange={(e) =>
										setUserState({
											...userState,
											confirmPassword: e.target.value,
										})
									}
									value={userState.confirmPassword}
								/>
							</>
						)}
					</>
				)}
				<Box sx={{ mb: 2 }}>
					<SubscriptionManagement user={user} />
				</Box>
				<Box sx={{ mb: 3 }}>
					<Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
						Social Connections
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						{/* Facebook */}
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								p: 1.5,
								border: '1px solid #e0e0e0',
								borderRadius: 1,
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<FacebookIcon />
								<Typography>Facebook</Typography>
							</Box>
							{user.facebookId ? (
								<Button
									variant="outlined"
									color="error"
									size="small"
									onClick={() => handleDisconnectClick('facebook')}
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
								p: 1.5,
								border: '1px solid #e0e0e0',
								borderRadius: 1,
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<GoogleIcon />
								<Typography>Google</Typography>
							</Box>
							{user.googleId ? (
								<Button
									variant="outlined"
									color="error"
									size="small"
									onClick={() => handleDisconnectClick('google')}
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
								p: 1.5,
								border: '1px solid #e0e0e0',
								borderRadius: 1,
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<XIcon />
								<Typography>X</Typography>
							</Box>
							{user.twitterId ? (
								<Button
									variant="outlined"
									color="error"
									size="small"
									onClick={() => handleDisconnectClick('twitter')}
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
								>
									Connect
								</Button>
							)}
						</Box>
					</Box>
				</Box>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<Button
						variant="outlined"
						color="secondary"
						size={fullscreen ? 'small' : 'medium'}
						onClick={handleEditToggle}
					>
						Cancel
					</Button>
					<Box display="flex" justifyContent="flex-end">
						<Button
							variant="contained"
							color="error"
							sx={{ mr: 1 }}
							size={fullscreen ? 'small' : 'medium'}
							onClick={() => setDialogOpen(true)}
						>
							Delete Account
						</Button>
						<Button
							variant="contained"
							color="primary"
							size={fullscreen ? 'small' : 'medium'}
							onClick={handleSave}
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
