import {
	Box,
	Typography,
	Button,
	Divider,
	IconButton,
	alpha,
	useTheme,
} from '@mui/material';
import {
	Person as PersonIcon,
	Email as EmailIcon,
	Lock as LockIcon,
	Edit as EditIcon,
	Link as LinkIcon,
} from '@mui/icons-material';
import { FacebookIcon, GoogleIcon, XIcon } from '@assets/icons/CustomIcons';
import { useAuth } from '@hooks';

type ViewProfileProps = {
	handleEditToggle: () => void;
};

const ViewProfile = ({ handleEditToggle }: ViewProfileProps) => {
	const theme = useTheme();
	const { user } = useAuth();

	if (!user) return null;

	const socialLogin =
		!!user?.googleId || !!user?.facebookId || !!user?.twitterId;

	const InfoRow = ({ icon: Icon, label, value, showDivider = true }: any) => (
		<Box sx={{ mb: showDivider ? 3 : 0 }}>
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1.5 }}>
				<Icon sx={{ color: 'text.secondary', fontSize: 20 }} />
				<Typography
					variant="subtitle2"
					color="text.secondary"
					sx={{
						textTransform: 'uppercase',
						letterSpacing: 0.5,
						fontWeight: 600,
					}}
				>
					{label}
				</Typography>
			</Box>
			<Typography variant="body1" sx={{ pl: 4.5, fontWeight: 500 }}>
				{value}
			</Typography>
			{showDivider && <Divider sx={{ mt: 2, opacity: 0.6 }} />}
		</Box>
	);

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					mb: 4,
				}}
			>
				<Box>
					<Typography variant="h6" fontWeight="bold">
						Personal Information
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Update your personal details and how we can contact you.
					</Typography>
				</Box>
				<Button
					variant="outlined"
					startIcon={<EditIcon />}
					onClick={handleEditToggle}
					sx={{ borderRadius: 2 }}
				>
					Edit
				</Button>
			</Box>

			<InfoRow
				icon={PersonIcon}
				label="Full Name"
				value={user.name || 'Not provided'}
			/>
			<InfoRow
				icon={EmailIcon}
				label="Email Address"
				value={user.email || 'Not provided'}
			/>

			{user.passwordHash && (
				<InfoRow icon={LockIcon} label="Password" value="••••••••••••" />
			)}

			{socialLogin && (
				<Box sx={{ mt: 2 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
						<LinkIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
						<Typography
							variant="subtitle2"
							color="text.secondary"
							sx={{
								textTransform: 'uppercase',
								letterSpacing: 0.5,
								fontWeight: 600,
							}}
						>
							Connected Accounts
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', gap: 2, pl: 4.5 }}>
						{user.facebookId && (
							<Box
								sx={{
									p: 1,
									border: '1px solid',
									borderColor: 'divider',
									borderRadius: 1.5,
									display: 'flex',
								}}
							>
								<FacebookIcon />
							</Box>
						)}
						{user.googleId && (
							<Box
								sx={{
									p: 1,
									border: '1px solid',
									borderColor: 'divider',
									borderRadius: 1.5,
									display: 'flex',
								}}
							>
								<GoogleIcon />
							</Box>
						)}
						{user.twitterId && (
							<Box
								sx={{
									p: 1,
									border: '1px solid',
									borderColor: 'divider',
									borderRadius: 1.5,
									display: 'flex',
								}}
							>
								<XIcon />
							</Box>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default ViewProfile;
