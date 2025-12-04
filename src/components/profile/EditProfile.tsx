import FloatingButton from '@components/common/FloatingButton';
import {
	Box,
	TextField,
	Typography,
	IconButton,
	Button,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { useAuth } from '@hooks';
import { useState } from 'react';
import DeleteAccountDialog from './DeleteAccountDialog';
import { FacebookIcon, GoogleIcon } from '@assets/icons/CustomIcons';

type EditProfileProps = {
	handleEditToggle: () => void;
	handleSave: () => void;
};

const EditProfile = ({ handleEditToggle, handleSave }: EditProfileProps) => {
	const { user } = useAuth();
	const theme = useTheme();
	const [changePassword, setChangePassword] = useState(false);
	const fullscreen = useMediaQuery(theme.breakpoints.down('sm'));
	const socialLogin = !!user?.appleId || !!user?.googleId || !!user?.facebookId;

	const [dialogOpen, setDialogOpen] = useState(false);
	const [userState, setUserState] = useState({
		name: user?.name ?? '',
		email: user?.email ?? '',
		password: '*********',
		newPassword: '',
		confirmPassword: '',
	});

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
				{socialLogin && (
					<Box>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Social Connections
						</Typography>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								mb: 2,
							}}
						>
							<Box
								display="flex"
								alignItems="center"
								width="100%"
								justifyContent="space-evenly"
							>
								{user.facebookId && (
									<FloatingButton>
										<Typography sx={{ pr: 2 }}>Disconnect</Typography>
										<FacebookIcon />
									</FloatingButton>
								)}
								{user.googleId && (
									<FloatingButton>
										<Typography sx={{ pr: 2 }}>Disconnect</Typography>
										<GoogleIcon />
									</FloatingButton>
								)}
							</Box>
						</Box>
						<IconButton />
					</Box>
				)}
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
		</>
	);
};

export default EditProfile;
