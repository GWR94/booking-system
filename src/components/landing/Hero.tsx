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
import { motion, useAnimation, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { SportsGolf, LocationOn, StarOutline } from '@mui/icons-material';
import { useRef, useEffect } from 'react';
import { useAnimationContext } from '../../context/AnimationContext';
import TestimonialCarousel from './TestimonialCarousel';

const Hero = () => {
	const { initialAnimationsCompleted, setInitialAnimationsCompleted } =
		useAnimationContext();
	const controls = useAnimation();
	const hasAnimatedRef = useRef(false);
	const navigate = useNavigate();
	const theme = useTheme();

	// Create consistent motion components
	const MotionBox = motion.create(Box);
	const MotionTypography = motion.create(Typography);
	const MotionButton = motion.create(Button);
	const MotionGrid = motion.create(Grid);
	const MotionStack = motion.create(Stack);
	const MotionChip = motion.create(Chip);

	// Create variants that match your other components
	const heroContainerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.1,
				duration: 0.6,
				ease: 'easeOut',
			},
		},
	};

	const childVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: 'easeOut',
			},
		},
	};

	const imageVariants: Variants = {
		hidden: { opacity: 0, x: 40 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.8,
				ease: [0.22, 1, 0.36, 1],
			},
		},
	};

	const testimonialVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				delay: 0.2,
				ease: 'easeOut',
			},
		},
	};

	const infoBarVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.6,
				delay: 0.4,
			},
		},
	};

	// Use this effect to control animation based on context
	useEffect(() => {
		// If animations are already completed globally, just set to visible without animating
		if (initialAnimationsCompleted) {
			controls.set('visible');
			return;
		}

		// If not yet animated, run the animation and update the context
		if (!hasAnimatedRef.current) {
			controls.start('visible').then(() => {
				hasAnimatedRef.current = true;
				// Mark animations as completed for the entire app
				setInitialAnimationsCompleted(true);
			});
		}
	}, [controls, initialAnimationsCompleted, setInitialAnimationsCompleted]);

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
				<MotionGrid
					container
					spacing={4}
					alignItems="center"
					animate={controls}
					whileInView="visible"
					initial="hidden"
					viewport={{ once: true, amount: 0.2 }}
					variants={heroContainerVariants}
				>
					<MotionGrid size={{ xs: 12, md: 7 }}>
						{/* Hero badge */}
						<MotionChip
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
							variants={childVariants}
						/>

						<MotionTypography
							variant="h2"
							sx={{
								fontWeight: 700,
								mb: 2,
								textShadow: '0px 2px 4px rgba(0,0,0,0.15)',
								fontSize: { xs: '2.5rem', md: '3.5rem' },
							}}
							variants={childVariants}
						>
							Tee Up Your Perfect Game
						</MotionTypography>

						<MotionTypography
							variant="h5"
							gutterBottom
							sx={{
								fontWeight: 400,
								mb: 3,
								opacity: 0.9,
								maxWidth: 600,
							}}
							variants={childVariants}
						>
							Indoor Golf Simulator Experience in the Heart of Maidstone
						</MotionTypography>

						<MotionTypography
							variant="body1"
							sx={{
								maxWidth: 600,
								mb: 4,
								lineHeight: 1.7,
								opacity: 0.85,
								fontWeight: 400,
							}}
							variants={childVariants}
						>
							Practice, play, and improve your golf game year-round in our
							state-of-the-art simulator facility. Experience premium TrackMan
							technology, play world-class courses, and take your game to the
							next level regardless of weather conditions.
						</MotionTypography>

						<MotionStack
							direction="row"
							spacing={2}
							sx={{ mb: 5 }}
							variants={childVariants}
						>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
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
						</MotionStack>

						<MotionStack
							direction={{ xs: 'column', sm: 'row' }}
							spacing={2}
							variants={childVariants}
						>
							<MotionButton
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
								whileHover={{
									scale: 1.03,
									boxShadow: '0 6px 20px 0 rgba(0,0,0,0.3)',
									transition: { duration: 0.2 },
								}}
								whileTap={{ scale: 0.98 }}
							>
								Book a Session Now
							</MotionButton>
							<MotionButton
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
								whileHover={{
									scale: 1.02,
									transition: {
										duration: 0.15,
										ease: 'easeOut',
									},
								}}
								whileTap={{ scale: 0.98 }}
							>
								Learn More
							</MotionButton>
						</MotionStack>
					</MotionGrid>

					<MotionGrid
						size={{ xs: 12, md: 5 }}
						sx={{ display: { xs: 'none', md: 'block' } }}
					>
						{/* Hero image or visual element */}
						<MotionBox
							sx={{
								position: 'relative',
								height: 400,
								borderRadius: 4,
								overflow: 'hidden',
								boxShadow:
									'0 24px 38px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
								border: '5px solid rgba(255,255,255,0.1)',
							}}
							variants={imageVariants}
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
						</MotionBox>

						{/* Testimonial snippet */}
						<TestimonialCarousel />
					</MotionGrid>
				</MotionGrid>

				{/* Bottom info bar */}
				<MotionBox
					sx={{
						mt: { xs: 6, md: 10 },
						pt: 3,
						borderTop: '1px solid rgba(255,255,255,0.2)',
						display: 'flex',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
						gap: 2,
					}}
					variants={infoBarVariants}
					initial="hidden"
					animate={controls}
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
				</MotionBox>
			</Container>
		</Box>
	);
};

export default Hero;
