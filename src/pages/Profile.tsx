import React, { useEffect, useState } from 'react';
import {
	Box,
	Typography,
	TextField,
	Button,
	IconButton,
	Dialog,
	DialogActions,
	useMediaQuery,
	useTheme,
	DialogTitle,
	DialogContent,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { FacebookIcon, GoogleIcon } from '../assets/icons/CustomIcons';
import FloatingButton from '../components/common/FloatingButton';

const ProfilePage = () => {
	const theme = useTheme();
	const fullscreen = useMediaQuery(theme.breakpoints.down('sm'));
	const { user } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [userState, setUserState] = useState({
		name: user?.name ?? '',
		email: user?.email ?? '',
		password: '*********',
		newPassword: '',
		confirmPassword: '',
	});
	const [changePassword, setChangePassword] = useState(false);

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
	};

	const handleSave = () => {
		// TODO
		setIsEditing(false);
	};

	const handleDelete = () => {
		// TODO
	};

	const socialLogin = !!user?.appleId || !!user?.googleId || !!user?.facebookId;

	return (
		<>
			<Box sx={{ maxWidth: 600, margin: 'auto', my: 4 }}>
				<Typography
					variant="h4"
					component="h1"
					sx={{ mb: 3, textAlign: 'center' }}
				>
					User Profile
				</Typography>
				{isEditing ? (
					<Box>
						<TextField
							fullWidth
							label="Name"
							variant="outlined"
							sx={{ mb: 2 }}
							onChange={(e) =>
								setUserState({ ...userState, name: e.target.value })
							}
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
						{user?.passwordHash && (
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
				) : (
					<Box>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								mb: 2,
							}}
						>
							<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
								Name
							</Typography>
							<Typography variant="body1">
								{user?.name ?? 'Not provided'}
							</Typography>
						</Box>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								mb: 2,
							}}
						>
							<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
								Email
							</Typography>
							<Typography variant="body1">
								{user?.email ?? 'Not provided'}
							</Typography>
						</Box>
						{user?.passwordHash && (
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									mb: 2,
								}}
							>
								<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
									Password
								</Typography>
								<Typography variant="body1">**********</Typography>
							</Box>
						)}
						{socialLogin && (
							<>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
										Social Connections
									</Typography>
									<div>
										{user.facebookId && <FacebookIcon />}
										{user.googleId && <GoogleIcon />}
									</div>
								</Box>
							</>
						)}
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'flex-end',
								width: '100%',
								p: 2,
							}}
						>
							<Button
								variant="contained"
								color="primary"
								onClick={handleEditToggle}
							>
								Edit Profile
							</Button>
						</Box>
					</Box>
				)}
				<Dialog
					open={dialogOpen}
					fullScreen={fullscreen}
					onClose={() => setDialogOpen(false)}
				>
					<DialogTitle>Delete Account?</DialogTitle>
					<DialogContent>
						<Typography>
							Are you sure you want to delete your account? This cannot be
							undone.
						</Typography>
						<Typography>
							This will revoke all social media connections and delete all of
							your data.
						</Typography>
					</DialogContent>
					<DialogActions>
						<Button
							variant="outlined"
							onClick={() => setDialogOpen(false)}
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
			</Box>
		</>
	);
};

export default ProfilePage;
