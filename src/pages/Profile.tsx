import React, { useEffect, useState } from 'react';
import {
	Box,
	Typography,
	TextField,
	Button,
	Card,
	CardContent,
	CardActions,
	IconButton,
	Dialog,
	DialogActions,
	useMediaQuery,
	useTheme,
	DialogTitle,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { FacebookIcon, GoogleIcon } from '../assets/icons/CustomIcons';
import FloatingButton from '../components/common/FloatingButton';

const ProfilePage = () => {
	const theme = useTheme();
	const fullscreen = useMediaQuery(theme.breakpoints.down('md'));
	const { user } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [userState, setUserState] = useState({
		name: user?.name ?? '',
		email: user?.email ?? '',
		password: '',
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
			<Card sx={{ maxWidth: 600, margin: 'auto', my: 4 }}>
				<CardContent>
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
										placeholder={changePassword ? '' : 'Click to change'}
										sx={{ mb: 2 }}
										onChange={(e) =>
											setUserState({ ...userState, password: e.target.value })
										}
										value={userState.password}
									/>
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
									<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
										Social Connections
									</Typography>
									<Box
										maxWidth="xs"
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
						</Box>
					) : (
						<Box>
							<Typography
								variant="h4"
								component="h1"
								sx={{ mb: 3, textAlign: 'center' }}
							>
								User Profile
							</Typography>
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
						</Box>
					)}
				</CardContent>
				<CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
					{!isEditing ? (
						<Button
							variant="contained"
							color="primary"
							onClick={handleEditToggle}
						>
							Edit Profile
						</Button>
					) : (
						<>
							<Button
								variant="outlined"
								color="secondary"
								onClick={handleEditToggle}
							>
								Cancel
							</Button>
							<Box display="flex" justifyContent="flex-end">
								<Button
									variant="contained"
									color="error"
									sx={{ mr: 1 }}
									onClick={() => setDialogOpen(true)}
								>
									Delete Account
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={handleSave}
								>
									Save Changes
								</Button>
							</Box>
						</>
					)}
				</CardActions>
			</Card>
			<Dialog
				open={dialogOpen}
				fullScreen={fullscreen}
				onClose={() => setDialogOpen(false)}
			>
				<DialogTitle>Delete Account?</DialogTitle>
				<Typography>
					Are you sure you want to delete your account? This cannot be undone.
				</Typography>
				<Typography>
					This will revoke all social media logins and delete all of your data.
				</Typography>
				<DialogActions>
					<Button variant="outlined" onClick={() => setDialogOpen(false)}>
						Cancel
					</Button>
					<Button variant="contained" color="error" onClick={handleDelete}>
						Delete Account
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ProfilePage;
