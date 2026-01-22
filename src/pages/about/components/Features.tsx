import {
	StarBorder,
	EventAvailable,
	SportsGolf,
	Business,
	Diversity3,
	EmojiEvents,
} from '@mui/icons-material';
import {
	Paper,
	Typography,
	Grid2 as Grid,
	Box,
	useTheme,
	Container,
	Icon,
} from '@mui/material';

const features = [
	{
		title: 'Premium Equipment',
		description:
			'Experience golf on TrackMan 4 systems, the same technology used by top professionals worldwide.',
		icon: StarBorder,
	},
	{
		title: 'Convenient Booking',
		description:
			'Reserve your bay online anytime with our easy-to-use booking system for hassle-free scheduling.',
		icon: EventAvailable,
	},
	{
		title: 'Membership Tiers',
		description:
			'Join one of our membership tiers to access exclusive discounts and benefits.',
		icon: SportsGolf,
	},
	{
		title: 'Central Location',
		description:
			'Conveniently located on High Street in Maidstone with easy access to parking and public transport.',
		icon: Business,
	},
	{
		title: 'Community Focus',
		description:
			'Join a welcoming community of golf enthusiasts through our regular events and leagues.',
		icon: Diversity3,
	},
	{
		title: 'Data-Driven Improvement',
		description:
			'Track your progress with detailed performance statistics after every session.',
		icon: EmojiEvents,
	},
];

const Features = () => {
	const theme = useTheme();
	return (
		<Paper
			elevation={0}
			sx={{
				py: 4,
			}}
		>
			<Container
				maxWidth="lg"
				sx={{
					p: 4,
				}}
			>
				<Typography
					variant="title"
					component="h2"
					gutterBottom
					sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 8 }}
				>
					Why Choose The Short Grass?
				</Typography>

				<Grid container spacing={3} gap={3}>
					{features.map((feature, index) => (
						<Grid key={index} size={{ xs: 12, sm: 6, md: 4 }} sx={{ mb: 2 }}>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<feature.icon
									sx={{
										fontSize: 22,
										mr: 1.5,
										color: theme.palette.secondary.main,
									}}
								/>
								<Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
									{feature.title}
								</Typography>
							</Box>
							<Box>
								<Typography variant="body2" color="text.secondary">
									{feature.description}
								</Typography>
							</Box>
						</Grid>
					))}
				</Grid>
			</Container>
		</Paper>
	);
};

export default Features;
