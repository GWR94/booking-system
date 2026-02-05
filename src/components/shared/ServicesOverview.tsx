import { AnimateIn, SectionHeader } from '@ui';
import { ArrowForward } from '@mui/icons-material';
import {
	Box,
	Typography,
	Grid2 as Grid,
	Card,
	CardContent,
	CardMedia,
	Container,
	useTheme,
	Button,
	alpha,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const offers = [
	{
		title: 'Precision Simulation',
		description:
			'Experience the gold standard in tracking. Our TrackMan 4 bays deliver accurate data and over 100 world-famous courses in stunning 4K.',
		image: '/services/sim-room.webp',
		link: '/book',
		linkText: 'Book a Bay',
	},
	{
		title: 'Professional Coaching',
		description:
			'Unlock your potential with expert tuition. Our PGA professionals use elite video analysis to transform your game, one swing at a time.',
		image: '/services/coaching.webp',
		link: '/contact',
		linkText: 'Enquire Now',
	},
	{
		title: 'The Clubhouse Vibe',
		description:
			'Relax in our contemporary lounge with a selection of premium drinks and snacks. The perfect atmosphere for post-round analysis.',
		image: '/services/clubhouse.webp',
		// No link, scrolls to bar section or just informational
	},
	{
		title: 'Private Events',
		description:
			'From corporate team days to private celebrations, make it memorable. Exclusive venue hire available with tailored catering packages.',
		image: '/services/events.webp',
		link: '/contact',
		linkText: 'Plan an Event',
	},
];

const ServicesOverview = () => {
	const theme = useTheme();
	return (
		<Box
			sx={{
				py: 10,
				background: `linear-gradient(to bottom, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
			}}
		>
			<Container maxWidth="lg">
				<SectionHeader
					subtitle="OVERVIEW"
					title="Everything You Need"
					description="The Short Grass is Maidstone's ultimate indoor golf destination. We combine state-of-the-art TrackMan technology with a premium lounge atmosphere, offering professional coaching, casual play, and private events for golfers of all levels."
				/>

				<Grid container spacing={4}>
					{offers.map((offer, index) => (
						<Grid key={offer.title} size={{ xs: 12, md: 6 }}>
							<AnimateIn
								type="fade-up"
								delay={index * 0.1}
								style={{ height: '100%' }}
							>
								<Card
									elevation={0}
									sx={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										bgcolor: 'background.paper',
										border: 'none',
										borderRadius: 4,
										overflow: 'hidden',
										transition: 'all 0.3s ease',
										boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.12)}`,
											'& .card-media': {
												transform: 'scale(1.05)',
											},
											'& .learn-more-btn': {
												transform: 'translateX(4px)',
											},
										},
									}}
								>
									<Box sx={{ overflow: 'hidden', height: 320 }}>
										<CardMedia
											component="img"
											className="card-media"
											image={offer.image}
											title={offer.title}
											sx={{
												height: '100%',
												width: '100%',
												objectFit: 'cover',
												transition: 'transform 0.5s ease',
											}}
										/>
									</Box>
									<CardContent
										sx={{
											p: 4,
											flexGrow: 1,
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'flex-start',
										}}
									>
										<Typography
											variant="h5"
											component="h3"
											gutterBottom
											sx={{ fontWeight: 700 }}
										>
											{offer.title}
										</Typography>
										<Typography
											variant="body1"
											color="text.secondary"
											sx={{ mb: 3, lineHeight: 1.6, flexGrow: 1 }}
										>
											{offer.description}
										</Typography>
										{offer.link && (
											<Button
												component={RouterLink}
												to={offer.link}
												variant="text"
												color="primary"
												endIcon={
													<ArrowForward
														className="learn-more-btn"
														sx={{ transition: 'transform 0.2s ease' }}
													/>
												}
												sx={{
													p: 0,
													fontWeight: 600,
													'&:hover': {
														bgcolor: 'transparent',
														textDecoration: 'underline',
													},
												}}
											>
												{offer.linkText}
											</Button>
										)}
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

export default ServicesOverview;
