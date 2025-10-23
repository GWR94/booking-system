import {
	Container,
	Typography,
	Button,
	Box,
	Grid2 as Grid,
	Stack,
	Divider,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'motion/react';
import { SportsGolf, EventAvailable, PhoneInTalk } from '@mui/icons-material';

const CallToAction = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const MotionBox = motion.create(Box);
	const MotionTypography = motion.create(Typography);
	const MotionButton = motion.create(Button);
	const MotionStack = motion.create(Stack);

	// Child variants for staggered animations
	const childVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: 'easeOut' },
		},
	};

	// Container variant for staggered children
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.1,
			},
		},
	};

	return (
		<MotionBox
			sx={{
				background: `linear-gradient(to bottom, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
				color: theme.palette.primary.contrastText,
				py: { xs: 8, md: 12 },
				position: 'relative',
				overflow: 'hidden',
			}}
			variants={containerVariants}
		>
			<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 5 }}>
				<Grid container spacing={4} alignItems="center">
					<Grid size={{ xs: 12, md: 7 }}>
						<MotionTypography
							variant="h2"
							sx={{
								fontWeight: 700,
								mb: 2,
								fontSize: { xs: '2.5rem', md: '3rem' },
								textShadow: '0 2px 10px rgba(0,0,0,0.2)',
							}}
							variants={childVariants}
						>
							Ready to Improve Your Golf Game?
						</MotionTypography>

						<MotionTypography
							variant="h5"
							sx={{
								mb: 4,
								fontWeight: 400,
								opacity: 0.9,
								maxWidth: 600,
							}}
							variants={childVariants}
						>
							Experience TrackMan technology, play world-class courses, and
							elevate your skills year-round.
						</MotionTypography>

						<MotionStack
							direction="row"
							spacing={3}
							sx={{ mb: 5 }}
							variants={childVariants}
						>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<SportsGolf
									sx={{ mr: 1, color: theme.palette.secondary.light }}
								/>
								<Typography variant="body1">Premium Experience</Typography>
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<EventAvailable
									sx={{ mr: 1, color: theme.palette.secondary.light }}
								/>
								<Typography variant="body1">Easy Booking</Typography>
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
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									px: { xs: 0, sm: 2 },
									py: { xs: 2, sm: 0 },
								}}
							>
								<PhoneInTalk
									sx={{ mr: 1.5, color: theme.palette.secondary.main }}
								/>
								<Box>
									<Typography variant="caption" sx={{ opacity: 0.75 }}>
										Or call us directly
									</Typography>
									<Typography variant="body2" sx={{ fontWeight: 500 }}>
										+44 79874 45123
									</Typography>
								</Box>
							</Box>
						</MotionStack>
					</Grid>

					<Grid
						size={{ xs: 12, md: 5 }}
						sx={{ display: { xs: 'none', md: 'block' } }}
					>
						<MotionBox
							sx={{
								position: 'relative',
								backgroundColor: alpha(theme.palette.common.white, 0.08),
								borderRadius: 3,
								p: 4,
								boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
								border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
								backdropFilter: 'blur(8px)',
							}}
							variants={childVariants}
						>
							<Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
								Membership Benefits
							</Typography>

							<Stack
								spacing={2}
								divider={
									<Divider
										sx={{ borderColor: alpha(theme.palette.common.white, 0.2) }}
									/>
								}
							>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography>Priority Booking</Typography>
									<Typography sx={{ color: theme.palette.secondary.light }}>
										✓
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography>Discounted Rates</Typography>
									<Typography sx={{ color: theme.palette.secondary.light }}>
										✓
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography>Free Shot Analysis</Typography>
									<Typography sx={{ color: theme.palette.secondary.light }}>
										✓
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography>Monthly Events</Typography>
									<Typography sx={{ color: theme.palette.secondary.light }}>
										✓
									</Typography>
								</Box>
							</Stack>

							<Button
								variant="outlined"
								color="accent"
								fullWidth
								onClick={() => navigate('/membership')}
								sx={{
									mt: 3,
								}}
							>
								View Membership Options
							</Button>
						</MotionBox>
					</Grid>
				</Grid>
			</Container>
		</MotionBox>
	);
};

export default CallToAction;
