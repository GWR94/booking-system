import {
	Box,
	Container,
	Typography,
	Button,
	useTheme,
	Grid2 as Grid,
	Stack,
	Chip,
	Avatar,
} from '@mui/material';

import TestimonialCarousel from './TestimonialCarousel';
import { StarOutline, SportsGolf, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AnimateIn from '../common/AnimateIn';

const Hero = () => {
	const navigate = useNavigate();
	const theme = useTheme();

	return (
		<Box
			sx={{
				background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main} 100%)`,
				color: theme.palette.primary.contrastText,
				py: { xs: 8, md: 12 },
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<Container maxWidth="lg">
				<Grid key="hero-content" container spacing={4} alignItems="center">
					<Grid size={{ xs: 12, md: 7 }}>
						<AnimateIn>
							{/* Hero badge */}
							<Chip
								icon={<StarOutline color="accent" />}
								label="PREMIUM GOLF EXPERIENCE"
								color="secondary"
								sx={{
									mb: 3,
									fontWeight: 500,
									color: theme.palette.accent.light,
									px: 1.5,
									backgroundColor: 'rgba(255, 255, 255, 0.15)',
									backdropFilter: 'blur(10px)',
									border: '1px solid rgba(255, 255, 255, 0.3)',
								}}
							/>

							<Typography
								variant="h2"
								sx={{
									fontWeight: 700,
									mb: 2,
									textShadow: '0px 2px 4px rgba(0,0,0,0.15)',
									fontSize: { xs: '2.5rem', md: '3.5rem' },
								}}
							>
								Tee Up Your Perfect Game
							</Typography>

							<Typography
								variant="h5"
								gutterBottom
								sx={{
									fontWeight: 400,
									mb: 3,
									opacity: 0.9,
									maxWidth: 600,
								}}
							>
								Indoor Golf Simulator Experience in the Heart of Maidstone
							</Typography>

							<Typography
								variant="body1"
								sx={{
									maxWidth: 600,
									mb: 4,
									lineHeight: 1.7,
									opacity: 0.85,
									fontWeight: 400,
								}}
							>
								Practice, play, and improve your golf game year-round in our
								state-of-the-art simulator facility. Experience premium TrackMan
								technology, play world-class courses, and take your game to the
								next level regardless of weather conditions.
							</Typography>

							<Stack
								direction="row"
								spacing={2}
								sx={{ mb: 5 }}
								textAlign="center"
							>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<SportsGolf
										sx={{ mr: 1, color: theme.palette.secondary.light }}
									/>
									<Typography variant="body2">4 Premium Bays</Typography>
								</Box>
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									<LocationOn
										sx={{ mr: 1, color: theme.palette.secondary.light }}
									/>
									<Typography variant="body2">Central Maidstone</Typography>
								</Box>
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									<StarOutline
										sx={{ mr: 1, color: theme.palette.secondary.light }}
									/>
									<Typography variant="body2">TrackMan Technology</Typography>
								</Box>
							</Stack>

							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
								<Button
									variant="contained"
									color="secondary"
									size="large"
									onClick={() => navigate('/book')}
									sx={{
										px: 4,
										py: 1.5,
										fontWeight: 600,
										borderRadius: 2,
										boxShadow: '0 4px 14px 0 rgba(0,0,0,0.25)',
									}}
								>
									Book a Session Now
								</Button>
								<Button
									variant="outlined"
									color="accent"
									size="large"
									onClick={() => navigate('/about')}
									sx={{
										px: 4,
										py: 1.5,
										fontWeight: 500,
										borderRadius: 2,
									}}
								>
									Learn More
								</Button>
							</Stack>
						</AnimateIn>
					</Grid>

					<Grid
						size={{ xs: 12, md: 5 }}
						sx={{ display: { xs: 'none', md: 'block' } }}
					>
						<AnimateIn delay={0.2}>
							{/* Hero image or visual element */}
							<Box
								sx={{
									position: 'relative',
									height: 400,
									borderRadius: 4,
									overflow: 'hidden',
									boxShadow:
										'0 24px 38px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
									border: '5px solid rgba(255,255,255,0.1)',
								}}
							>
								<Box
									component="img"
									src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
									alt="Premium golf simulator"
									sx={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										display: 'block',
									}}
								/>
								{/* Overlay with logo or branding */}
								<Box
									sx={{
										position: 'absolute',
										bottom: 0,
										left: 0,
										right: 0,
										py: 2,
										px: 3,
										background:
											'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<Typography
										variant="h6"
										sx={{ fontWeight: 600, color: 'white' }}
									>
										GWR Golf
									</Typography>
									<Chip
										label="TrackMan Certified"
										size="small"
										sx={{
											bgcolor: 'rgba(255,255,255,0.15)',
											color: 'white',
											fontWeight: 500,
										}}
									/>
								</Box>
							</Box>

							{/* Testimonial snippet */}
							<TestimonialCarousel />
						</AnimateIn>
					</Grid>
				</Grid>

				{/* Bottom info bar */}
				<Box
					key="hero-info-bar"
					sx={{
						mt: { xs: 6, md: 10 },
						pt: 3,
						borderTop: '1px solid rgba(255,255,255,0.2)',
						display: 'flex',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
						gap: 2,
					}}
				>
					<Typography variant="body2" sx={{ opacity: 0.7 }}>
						Located at: High St, Maidstone ME14 1JL, UK
					</Typography>
					<Typography variant="body2" sx={{ opacity: 0.7 }}>
						Open 7 days a week | 8:00 AM - 10:00 PM
					</Typography>
					<Typography variant="body2" sx={{ opacity: 0.7 }}>
						+44 79874 45123
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};

export default Hero;
