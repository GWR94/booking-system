import { Box, Typography, Button } from '@mui/material';
import { FacebookIcon, GoogleIcon } from '../../assets/icons/CustomIcons';
import { useAuth } from '@hooks/useAuth';

type ViewProfileProps = {
	handleEditToggle: () => void;
};

const ViewProfile = ({ handleEditToggle }: ViewProfileProps) => {
	const { user } = useAuth();
	const socialLogin = !!user?.appleId || !!user?.googleId || !!user?.facebookId;

	if (!user) return null;
	return (
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
				<Typography variant="body1">{user?.name ?? 'Not provided'}</Typography>
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
				<Typography variant="body1">{user?.email ?? 'Not provided'}</Typography>
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
				<Button variant="contained" color="primary" onClick={handleEditToggle}>
					Edit Profile
				</Button>
			</Box>
		</Box>
	);
};

export default ViewProfile;
