import {
	Box,
	Container,
	Typography,
	Button,
	useTheme,
	Grid2 as Grid,
	Stack,
	Chip,
	alpha,
} from '@mui/material';
import TestimonialCarousel from './TestimonialCarousel';
import {
	StarOutline,
	SportsGolf,
	LocationOn,
	CardMembership,
	CalendarToday,
	Diamond,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo from '/GLF-logo.png';
import { Logo, AnimateIn } from '@common';

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
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '120%',
					height: '120%',
					backgroundImage: `url(${logo})`,
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					backgroundSize: 'contain',
					opacity: 0.05,
					pointerEvents: 'none',
					zIndex: 0,
				}}
			/>
			<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
				<Grid container spacing={4} alignItems="center">
					<Grid size={{ xs: 12, md: 7 }}>
						<Box
							sx={{
								display: { xs: 'none', md: 'flex' },
								alignItems: 'center',
								justifyContent: 'center',
								mb: { xs: 0, md: 4 },
							}}
						>
							<AnimateIn type="fade-right">
								<Logo logoOnly sx={{ height: 100 }} />
							</AnimateIn>
						</Box>
						<Typography
							variant="h2"
							sx={{
								fontWeight: 700,
								display: 'block',
								mb: 2,
								textShadow: '0px 2px 4px rgba(0,0,0,0.25)',
								fontSize: { xs: '2.5rem', md: '3.5rem' },
							}}
						>
							<AnimateIn type="fade-right">Tee Up Your Perfect Game</AnimateIn>
						</Typography>

						<Typography
							variant="h5"
							gutterBottom
							sx={{
								fontWeight: 400,
								mb: 3,
								opacity: 0.9,
							}}
						>
							<AnimateIn type="fade-right">
								Indoor Golf Simulator Experience in the Heart of Maidstone
							</AnimateIn>
						</Typography>
						<AnimateIn type="fade-right" delay={0.4}>
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
										flexDirection: 'column',
										alignItems: 'center',
									}}
								>
									<SportsGolf sx={{ color: theme.palette.accent.main }} />
									<Typography variant="caption">4 Premium Bays</Typography>
								</Box>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
									}}
								>
									<LocationOn sx={{ color: theme.palette.accent.main }} />
									<Typography variant="caption">Central Maidstone</Typography>
								</Box>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
									}}
								>
									<StarOutline sx={{ color: theme.palette.accent.main }} />
									<Typography variant="caption">TrackMan Technology</Typography>
								</Box>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
									}}
								>
									<CardMembership
										sx={{ mx: 1, color: theme.palette.accent.main }}
									/>
									<Typography variant="caption">
										Flexible Memberships
									</Typography>
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
									onClick={() => navigate('/membership')}
									startIcon={<Diamond />}
									sx={{
										px: 4,
										py: 1.5,
										fontWeight: 600,
										borderRadius: 2,
										borderWidth: 2,
										background: 'rgba(255, 215, 0, 0.1)',
										borderColor: theme.palette.accent.main,
										'&:hover': {
											background: 'rgba(255, 215, 0, 0.2)',
											borderWidth: 2,
										},
									}}
								>
									View Plans
								</Button>
							</Stack>

							<Typography
								variant="caption"
								sx={{
									display: 'block',
									mt: 2,
									opacity: 0.8,
									maxWidth: 500,
									fontStyle: 'italic',
								}}
							>
								Secure your monthly practice time with{' '}
								<strong>Par, Birdie & Hole-In-One</strong> memberships including
								5, 10 or 15 hours of simulator access.
							</Typography>
						</AnimateIn>
					</Grid>

					<Grid
						size={{ xs: 12, md: 5 }}
						sx={{ display: { xs: 'none', md: 'block' } }}
					>
						<AnimateIn delay={0.2} type="fade-left">
							<Box sx={{ position: 'relative', perspective: '1000px' }}>
								<Box
									component="img"
									src="/hero-image.png"
									alt="Premium Golf Simulator"
									sx={{
										width: '100%',
										borderRadius: 4,
										boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
										transform: 'rotateY(-5deg) rotateX(2deg)',
										transition: 'transform 0.5s ease',
										'&:hover': {
											transform: 'rotateY(0deg) rotateX(0deg)',
										},
										mb: { xs: 2, md: -6 },
										position: 'relative',
										zIndex: 1,
										display: 'block',
									}}
								/>
								<Box
									sx={{
										position: 'relative',
										zIndex: 2,
										mx: { md: 4 },
										mt: { xs: -4, md: 0 },
									}}
								>
									<TestimonialCarousel />
								</Box>
							</Box>
						</AnimateIn>
					</Grid>
				</Grid>
				<AnimateIn type="fade-right" delay={1}>
					<Box
						sx={{
							mb: 3,
							width: '100%',
							display: { xs: 'none', md: 'flex' },
							flexDirection: 'row',
							justifyContent: 'center',
							flexWrap: 'wrap',
							gap: 2,
						}}
					>
						<Chip
							icon={<StarOutline color="secondary" />}
							label="PREMIUM GOLF EXPERIENCE"
							sx={{
								fontWeight: 600,
								color: theme.palette.secondary.light,
								px: 1,
								backgroundColor: alpha(theme.palette.secondary.main, 0.15),
								backdropFilter: 'blur(10px)',
								border: `1px solid ${theme.palette.secondary.main}`,
							}}
						/>
						<Chip
							icon={<SportsGolf color="info" />}
							label="TRACKMAN POWERED"
							sx={{
								fontWeight: 600,
								color: theme.palette.info.light,
								px: 1,
								backgroundColor: alpha(theme.palette.info.main, 0.15),
								backdropFilter: 'blur(10px)',
								border: `1px solid ${theme.palette.info.main}`,
							}}
						/>
						<Chip
							icon={<CardMembership color="success" />}
							label="MEMBERSHIPS AVAILABLE"
							onClick={() => navigate('/membership')}
							sx={{
								fontWeight: 600,
								color: theme.palette.success.light,
								px: 1,
								backgroundColor: alpha(theme.palette.success.main, 0.15),
								backdropFilter: 'blur(10px)',
								border: `1px solid ${theme.palette.success.main}`,
								cursor: 'pointer',
								'&:hover': {
									backgroundColor: alpha(theme.palette.success.main, 0.3),
								},
							}}
						/>
						<Chip
							icon={<CalendarToday color="warning" />}
							label="24/7 ONLINE BOOKING"
							onClick={() => navigate('/book')}
							sx={{
								fontWeight: 600,
								color: theme.palette.warning.light,
								px: 1,
								backgroundColor: alpha(theme.palette.warning.main, 0.15),
								backdropFilter: 'blur(10px)',
								border: `1px solid ${theme.palette.warning.main}`,
								cursor: 'pointer',
								'&:hover': {
									backgroundColor: alpha(theme.palette.warning.main, 0.3),
								},
							}}
						/>
						<Chip
							icon={<LocationOn sx={{ color: theme.palette.error.light }} />}
							label="CENTRAL MAIDSTONE"
							sx={{
								fontWeight: 600,
								color: theme.palette.error.light,
								px: 1,
								backgroundColor: alpha(theme.palette.error.main, 0.15),
								backdropFilter: 'blur(10px)',
								border: `1px solid ${theme.palette.error.main}`,
							}}
						/>
					</Box>
				</AnimateIn>

				<Box
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
						Open Mon-Sat | 10:00 AM - 10:00 PM
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
