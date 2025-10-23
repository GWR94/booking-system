import { Check } from '@mui/icons-material';
import {
	Box,
	Grid2 as Grid,
	Typography,
	Button,
	Paper,
	useTheme,
	Container,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion, Variants } from 'motion/react';

const Intro = () => {
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

	return (
		<Container maxWidth="lg" sx={{ py: 6 }}>
			<Grid container spacing={4} alignItems="center">
				<Grid size={{ xs: 12, md: 8 }}>
					<MotionBox
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={variant}
					>
						<Typography
							variant="h3"
							component="h2"
							gutterBottom
							sx={{
								fontWeight: 700,
								color: theme.palette.primary.main,
								position: 'relative',
								'&:after': {
									content: '""',
									position: 'absolute',
									bottom: -10,
									left: 0,
									width: 80,
									height: 4,
									backgroundColor: theme.palette.secondary.main,
								},
							}}
						>
							Premium Golf Simulation Experience
						</Typography>

						<Typography
							variant="h6"
							color="text.secondary"
							sx={{ my: 4, fontWeight: 400 }}
						>
							Welcome to GWR Golf Simulators, Maidstone's premier indoor golf
							facility offering year-round access to over 100 world-class
							courses.
						</Typography>

						<Typography variant="body1" sx={{ mb: 4 }}>
							Using state-of-the-art TrackMan technology, we deliver an
							unparalleled virtual golfing experience that allows you to play,
							practice, and improve regardless of weather conditions. Whether
							you're looking to work on your swing, play a round with friends,
							or host a corporate event, our modern facility provides the
							perfect environment for golfers of all skill levels.
						</Typography>

						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
							<Button
								variant="contained"
								size="large"
								component={RouterLink}
								to="/book"
								sx={{ fontWeight: 500, px: 3, borderRadius: 2 }}
							>
								Book a Session
							</Button>
							<Button
								variant="outlined"
								size="large"
								component={RouterLink}
								to="/contact"
								sx={{ fontWeight: 500, px: 3, borderRadius: 2 }}
							>
								Contact Us
							</Button>
						</Box>

						{/* Key benefits with icons */}
						<Box>
							<Grid container spacing={2}>
								{[
									{
										text: 'State-of-the-art TrackMan 4 technology',
										delay: 0.1,
									},
									{ text: 'Play over 100 world-class courses', delay: 0.2 },
									{ text: 'Professional coaching available', delay: 0.3 },
									{
										text: 'Open 7 days a week, all year round',
										delay: 0.4,
									},
								].map((item, index) => (
									<Grid size={{ xs: 12, sm: 6 }} key={index}>
										<MotionBox
											initial={{ opacity: 0, x: -20 }}
											whileInView={{
												opacity: 1,
												x: 0,
												transition: {
													delay: item.delay,
													duration: 0.5,
												},
											}}
											viewport={{ once: true }}
											sx={{
												display: 'flex',
												alignItems: 'center',
												mb: 1,
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													minWidth: 28,
													height: 28,
													borderRadius: '50%',
													backgroundColor: theme.palette.accent.main,
													mr: 1.5,
												}}
											>
												<Check
													sx={{
														fontSize: 16,
														color: theme.palette.common.white,
													}}
												/>
											</Box>
											<Typography variant="body1">{item.text}</Typography>
										</MotionBox>
									</Grid>
								))}
							</Grid>
						</Box>
					</MotionBox>
				</Grid>

				<Grid container size={{ xs: 12, md: 4 }} spacing={2}>
					<MotionBox
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{
							opacity: 1,
							scale: 1,
							transition: { duration: 0.7, ease: 'easeOut' },
						}}
						viewport={{ once: true, amount: 0.3 }}
					>
						<Paper
							elevation={6}
							sx={{
								borderRadius: 4,
								overflow: 'hidden',
								height: 400,
								position: 'relative',
							}}
						>
							<Box
								component="img"
								src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
								alt="Golf simulator in action"
								sx={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
							/>
						</Paper>
					</MotionBox>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Intro;
