import { AnimateIn } from '@ui';
import { SportsGolf, GolfCourse, AccessTime, Star } from '@mui/icons-material';
import {
	Grid2 as Grid,
	Card,
	CardContent,
	Box,
	Typography,
	useTheme,
	alpha,
	Container,
} from '@mui/material';

const features = [
	{
		icon: <SportsGolf fontSize="large" />,
		title: 'TrackMan 4 Technology',
		text: 'Experience the same radar technology used by the pros for unmatched accuracy.',
		delay: 0.1,
	},
	{
		icon: <GolfCourse fontSize="large" />,
		title: '100+ World-Class Courses',
		text: 'Play iconic venues like St Andrews, Pebble Beach, and more without leaving Maidstone.',
		delay: 0.2,
	},
	{
		icon: <AccessTime fontSize="large" />,
		title: 'Open Year-Round',
		text: 'Perfect conditions every day. Rain, wind, or darkness will never stop your game.',
		delay: 0.3,
	},
	{
		icon: <Star fontSize="large" />,
		title: 'Professional Coaching',
		text: 'Improve faster with data-driven instruction from our PGA certified professionals.',
		delay: 0.4,
	},
];

const MiniFeatures = () => {
	const theme = useTheme();
	return (
		<Container maxWidth="xl" sx={{ py: 10, position: 'relative', zIndex: 1 }}>
			<Grid container spacing={2}>
				{features.map((feature, index) => (
					<Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
						<AnimateIn
							type="fade-up"
							delay={feature.delay}
							style={{ height: '100%' }}
						>
							<Card
								elevation={0}
								sx={{
									height: '100%',
									borderRadius: 4,
									border: `1px solid ${theme.palette.divider}`,
									backgroundColor: alpha(theme.palette.background.paper, 0.8),
									backgroundImage: 'none',
									transition: 'all 0.3s ease',
									'&:hover': {
										transform: 'translateY(-8px)',
										boxShadow: theme.shadows[8],
									},
								}}
							>
								<CardContent sx={{ p: 4, textAlign: 'center' }}>
									<Box
										sx={{
											display: 'inline-flex',
											p: 2,
											borderRadius: '50%',
											backgroundColor: alpha(theme.palette.secondary.main, 0.1),
											color: theme.palette.secondary.main,
											mb: 2,
										}}
									>
										{feature.icon}
									</Box>
									<Typography
										variant="h6"
										component="h3"
										gutterBottom
										sx={{ fontWeight: 600 }}
									>
										{feature.title}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{feature.text}
									</Typography>
								</CardContent>
							</Card>
						</AnimateIn>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default MiniFeatures;
