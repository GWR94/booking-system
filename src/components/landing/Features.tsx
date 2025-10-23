import {
	alpha,
	Avatar,
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
import { motion, Variants } from 'motion/react';

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
	const MotionBox = motion.create(Box);

	const variant: Variants = {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: 'easeOut' },
		},
	};

	console.log(theme.palette.divider);

	return (
		<MotionBox
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.2 }}
			variants={variant}
			sx={{
				py: 10,
				backgroundColor: alpha(theme.palette.accent.light, 0.3),
			}}
		>
			<Container maxWidth="lg" sx={{ mb: 4 }}>
				<Box sx={{ textAlign: 'center', mb: 6 }}>
					<Typography
						variant="h3"
						component="h2"
						gutterBottom
						sx={{
							fontWeight: 700,
							color: theme.palette.primary.main,
						}}
					>
						Premium Features
					</Typography>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{
							maxWidth: 700,
							mx: 'auto',
							fontWeight: 400,
						}}
					>
						Experience golf like never before with our cutting-edge technology
						and premium amenities
					</Typography>
				</Box>
				<Grid container spacing={4} sx={{ mt: 4 }}>
					{simulatorFeatures.map((feature, index) => (
						<Grid size={{ xs: 12, md: 3 }} key={index}>
							<Box
								textAlign="center"
								sx={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-around',
									height: '100%',
								}}
							>
								<Avatar
									sx={{
										width: 80,
										height: 80,
										margin: 'auto',
										bgcolor: 'primary.dark',
										color: 'secondary.light',
									}}
								>
									{feature.icon}
								</Avatar>
								<Box
									sx={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
									}}
								>
									<Typography
										variant="h6"
										sx={{
											mb: 1,
										}}
									>
										{feature.title}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{feature.description}
									</Typography>
								</Box>
							</Box>
						</Grid>
					))}
				</Grid>
			</Container>
		</MotionBox>
	);
};

export default Features;
