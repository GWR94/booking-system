import {
	Box,
	Container,
	Typography,
	Chip,
	alpha,
	useTheme,
} from '@mui/material';
import {
	GenerateSlots,
	SessionPicker,
	NextPreviousButtons,
} from './components';
import { LoadingSpinner } from '@ui';
import { useSlots, useAuth } from '@hooks';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Booking = () => {
	const { isLoading } = useSlots();
	const { user } = useAuth();
	const theme = useTheme();

	const membershipUsage = user?.membershipUsage;

	/**
	 * FIXME - when there is slots in the basket and the user logs in,
	 * the slots disappear
	 */

	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: (theme) =>
					`linear-gradient(to bottom, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[300]} 100%)`,
				pt: 4,
			}}
		>
			<Container maxWidth="xl">
				<Box sx={{ mb: 4, textAlign: 'center' }}>
					<Typography
						variant="h4"
						component="h1"
						gutterBottom
						sx={{
							fontWeight: 800,
							background: (theme) =>
								`linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
							backgroundClip: 'text',
							textFillColor: 'transparent',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
					>
						Book Your Session
					</Typography>
					<Typography variant="subtitle1" color="text.secondary">
						Choose your preferred time and bay to get started
					</Typography>
				</Box>

				{membershipUsage && (
					<Box
						sx={{
							mb: 4,
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<Chip
							icon={<InfoOutlinedIcon />}
							label={`Member Benefit: ${membershipUsage.remainingHours} hour(s) remaining for this period`}
							variant="outlined"
							color="primary"
							sx={{
								px: 2,
								py: 3,
								borderRadius: 3,
								borderColor: alpha(theme.palette.primary.main, 0.3),
								bgcolor: alpha(theme.palette.primary.main, 0.05),
								fontWeight: 'bold',
								fontSize: '1rem',
								'& .MuiChip-icon': {
									color: theme.palette.primary.main,
								},
							}}
						/>
					</Box>
				)}

				<SessionPicker />

				<Box sx={{ mt: 4 }}>
					{isLoading ? (
						<LoadingSpinner sx={{ height: '200px' }} />
					) : (
						<>
							<GenerateSlots />
							<NextPreviousButtons />
						</>
					)}
				</Box>
			</Container>
		</Box>
	);
};

export default Booking;
