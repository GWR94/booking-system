import { AnimateIn } from '@ui';
import {
	SportsGolf,
	Check,
	EmojiEvents,
	Diversity3,
} from '@mui/icons-material';
import {
	Box,
	Typography,
	Grid2 as Grid,
	Card,
	CardContent,
	Divider,
	Stack,
	Container,
	useTheme,
} from '@mui/material';

const WhatWeOffer = () => {
	const theme = useTheme();
	return (
		<Container maxWidth="lg" sx={{ py: 6 }}>
			<AnimateIn type="fade-down">
				<Typography
					variant="title"
					align="center"
					gutterBottom
					sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 6 }}
				>
					What We Offer
				</Typography>
			</AnimateIn>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 4 }}>
					<AnimateIn type="fade-up" delay={0.1} style={{ height: '100%' }}>
						<Card
							elevation={0}
							sx={{
								height: '100%',
								border: `1px solid ${theme.palette.divider}`,
								borderRadius: 2,
								transition: 'all 0.3s ease',
								'&:hover': {
									boxShadow: 3,
									transform: 'translateY(-5px)',
								},
							}}
						>
							<CardContent
								sx={{
									p: 3,
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<SportsGolf
									sx={{
										fontSize: 48,
										color: theme.palette.secondary.main,
										mb: 2,
									}}
								/>
								<Typography
									variant="h5"
									component="h3"
									gutterBottom
									sx={{ fontWeight: 600 }}
								>
									State-of-the-Art Simulators
								</Typography>
								<Typography variant="body1" color="text.secondary">
									Our four TrackMan 4 simulator bays provide the most accurate
									ball and club tracking technology available. Experience over
									100 world-class golf courses in stunning HD graphics.
								</Typography>
								<Divider sx={{ mt: 'auto', mb: 2, pt: 2 }} />
								<Stack spacing={1}>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Check sx={{ color: theme.palette.success.main, mr: 1 }} />
										<Typography variant="body2">
											HD course visualization
										</Typography>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Check sx={{ color: theme.palette.success.main, mr: 1 }} />
										<Typography variant="body2">
											Precise ball tracking
										</Typography>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Check sx={{ color: theme.palette.success.main, mr: 1 }} />
										<Typography variant="body2">
											Detailed performance data
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</AnimateIn>
				</Grid>

				<Grid size={{ xs: 12, md: 4 }}>
					<AnimateIn type="fade-up" delay={0.2} style={{ height: '100%' }}>
						<Card
							elevation={0}
							sx={{
								height: '100%',
								border: `1px solid ${theme.palette.divider}`,
								borderRadius: 2,
								transition: 'all 0.3s ease',
								'&:hover': {
									boxShadow: 3,
									transform: 'translateY(-5px)',
								},
							}}
						>
							<CardContent
								sx={{
									p: 3,
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<EmojiEvents
									sx={{
										fontSize: 48,
										color: theme.palette.secondary.main,
										mb: 2,
									}}
								/>
								<Typography
									variant="h5"
									component="h3"
									gutterBottom
									sx={{ fontWeight: 600 }}
								>
									Professional Coaching
								</Typography>
								<Typography variant="body1" color="text.secondary">
									Improve your game with our PGA-certified instructors. Using
									video analysis and TrackMan data, we offer personalized
									coaching tailored to players of all skill levels.
								</Typography>
								<Divider sx={{ mt: 'auto', mb: 2 }} />
								<Stack spacing={1}>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Check sx={{ color: theme.palette.success.main, mr: 1 }} />
										<Typography variant="body2">
											PGA-certified coaches
										</Typography>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Check sx={{ color: theme.palette.success.main, mr: 1 }} />
										<Typography variant="body2">
											Video swing analysis
										</Typography>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Check sx={{ color: theme.palette.success.main, mr: 1 }} />
										<Typography variant="body2">
											Custom improvement plans
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</AnimateIn>
				</Grid>

				<Grid size={{ xs: 12, md: 4 }}>
					<AnimateIn type="fade-up" delay={0.3} style={{ height: '100%' }}>
						<Card
							elevation={0}
							sx={{
								height: '100%',
								border: `1px solid ${theme.palette.divider}`,
								borderRadius: 2,
								transition: 'all 0.3s ease',
								'&:hover': {
									boxShadow: 3,
									transform: 'translateY(-5px)',
								},
							}}
						>
							<CardContent
								sx={{
									p: 3,
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<Diversity3
									sx={{
										fontSize: 48,
										color: theme.palette.secondary.main,
										mb: 2,
									}}
								/>
								<Typography
									variant="h5"
									component="h3"
									gutterBottom
									sx={{ fontWeight: 600 }}
								>
									Events & Competitions
								</Typography>
								<Typography variant="body1" color="text.secondary" paragraph>
									Host your corporate event, birthday party, or join our regular
									tournaments and leagues. Our facility can accommodate groups
									of all sizes with customized packages.
								</Typography>
								<Divider sx={{ mt: 'auto', mb: 2 }} />
								<Stack spacing={1}>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Check sx={{ color: theme.palette.success.main, mr: 1 }} />
										<Typography variant="body2">Corporate packages</Typography>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Check sx={{ color: theme.palette.success.main, mr: 1 }} />
										<Typography variant="body2">Weekly leagues</Typography>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Check sx={{ color: theme.palette.success.main, mr: 1 }} />
										<Typography variant="body2">
											Private celebrations
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</AnimateIn>
				</Grid>
			</Grid>
		</Container>
	);
};

export default WhatWeOffer;
