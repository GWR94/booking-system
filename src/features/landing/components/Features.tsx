import {
	Box,
	Container,
	Grid2 as Grid,
	Typography,
	useTheme,
} from '@mui/material';
import {
	Group as GroupIcon,
	SportsGolf as SportsGolfIcon,
	EventAvailable as EventAvailableIcon,
	LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { AnimateIn } from '@ui';

const simulatorFeatures = [
	{
		icon: <SportsGolfIcon fontSize="large" />,
		title: 'Trackman 4 Technology',
		description:
			'Precision tracking of every aspect of your swing and ball flight.',
	},
	{
		icon: <GroupIcon fontSize="large" />,
		title: 'Group & Private Bookings',
		description: 'Perfect for individuals, friends, and corporate events.',
	},
	{
		icon: <EventAvailableIcon fontSize="large" />,
		title: 'Flexible Scheduling',
		description: 'Book hourly slots convenient for your schedule.',
	},
	{
		icon: <LocationOnIcon fontSize="large" />,
		title: 'Convenient Location',
		description:
			'Centrally located facility with ample parking and easy access.',
	},
];

const Features = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				py: 8,
				bgcolor: theme.palette.primary.main,
				color: 'common.white',
			}}
		>
			<Container maxWidth="xl">
				<Grid
					container
					spacing={4}
					justifyContent="space-around"
					alignItems="center"
				>
					{simulatorFeatures.map((feature, index) => (
						<Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
							<AnimateIn delay={index * 0.1} type="fade-up">
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										textAlign: 'center',
										p: 2,
									}}
								>
									<Box
										sx={{
											color: theme.palette.accent.main,
											mb: 2,
											transform: 'scale(1.2)',
										}}
									>
										{feature.icon}
									</Box>
									<Typography
										variant="h6"
										sx={{
											fontWeight: 700,
											mb: 1,
											fontSize: '1.1rem',
											letterSpacing: 0.5,
										}}
									>
										{feature.title}
									</Typography>
									<Typography
										variant="body2"
										sx={{
											color: 'rgba(255,255,255,0.7)',
											maxWidth: 250,
											mx: 'auto',
										}}
									>
										{feature.description}
									</Typography>
								</Box>
							</AnimateIn>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

export default Features;
