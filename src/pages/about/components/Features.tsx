import {
	StarBorder,
	EventAvailable,
	SportsGolf,
	Business,
	Diversity3,
	EmojiEvents,
	LocalBar,
} from '@mui/icons-material';
import {
	Typography,
	Grid2 as Grid,
	Box,
	useTheme,
	Container,
	Card,
	CardContent,
} from '@mui/material';
import { AnimateIn, SectionHeader } from '@ui';

const features = [
	{
		title: 'Premium Equipment',
		description:
			'Experience golf on TrackMan 4 systems, the same technology used by top professionals worldwide.',
		icon: StarBorder,
	},
	{
		title: 'Fully Licensed Bar',
		description:
			'Relax with a wide selection of drinks and watch live sports on our large 4K screens.',
		icon: LocalBar,
	},
	{
		title: 'Membership Tiers',
		description:
			'Join one of our membership tiers to access exclusive discounts, priority booking, and benefits.',
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
		title: 'Private Events',
		description:
			'The perfect venue for corporate events, parties, and celebrations with tailored packages.',
		icon: EmojiEvents,
	},
];

const Features = () => {
	const theme = useTheme();
	return (
		<Box sx={{ py: 8 }}>
			<Container maxWidth="lg">
				<SectionHeader subtitle="WHY US" title="Why Choose The Short Grass?" />

				<Grid container spacing={4}>
					{features.map((feature, index) => (
						<Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
							<AnimateIn
								type="fade-up"
								delay={index * 0.1}
								style={{ height: '100%' }}
							>
								<Card
									elevation={0}
									sx={{
										height: '100%',
										border: `1px solid ${theme.palette.divider}`,
										borderRadius: 2,
										transition: 'all 0.3s ease',
										'&:hover': {
											boxShadow: 3,
											transform: 'translateY(-4px)',
											borderColor: theme.palette.primary.main,
										},
									}}
								>
									<CardContent
										sx={{
											p: 3,
											display: 'flex',
											flexDirection: 'column',
											height: '100%',
										}}
									>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												mb: 2,
											}}
										>
											<feature.icon
												sx={{
													fontSize: 32,
													mr: 1.5,
													color: theme.palette.secondary.main,
												}}
											/>
											<Typography
												variant="h6"
												sx={{ fontWeight: 600, lineHeight: 1.2 }}
											>
												{feature.title}
											</Typography>
										</Box>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ flexGrow: 1 }}
										>
											{feature.description}
										</Typography>
									</CardContent>
								</Card>
							</AnimateIn>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

export default Features;
