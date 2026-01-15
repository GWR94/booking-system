import { Box, Typography, Button } from '@mui/material';
import { FacebookIcon, GoogleIcon, XIcon } from '@assets/icons/CustomIcons';
import { useAuth } from '@hooks';

type ViewProfileProps = {
	handleEditToggle: () => void;
};

const ViewProfile = ({ handleEditToggle }: ViewProfileProps) => {
	const { user } = useAuth();
	const socialLogin =
		!!user?.googleId || !!user?.facebookId || !!user?.twitterId;

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
							{user.twitterId && <XIcon />}
						</div>
					</Box>
				</>
			)}
			<Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
				<Button variant="contained" onClick={handleEditToggle}>
					Edit Profile
				</Button>
			</Box>
		</Box>
	);
};

export default ViewProfile;
