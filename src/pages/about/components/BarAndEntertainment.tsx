import { AnimateIn, SectionHeader } from '@ui';
import {
	Box,
	Typography,
	Grid2 as Grid,
	Container,
	Stack,
	useTheme,
	Button,
} from '@mui/material';
import { LocalBar, LiveTv, SportsBar, Weekend } from '@mui/icons-material';

const BarAndEntertainment = () => {
	const theme = useTheme();

	return (
		<Box sx={{ py: 8 }}>
			<Container maxWidth="lg">
				<Grid container spacing={6} alignItems="center">
					<Grid size={{ xs: 12, md: 6 }}>
						<AnimateIn type="fade-right">
							<Box
								component="img"
								src="/services/bar.webp"
								alt="Bar and Lounge Area"
								sx={{
									width: '100%',
									borderRadius: 4,
									boxShadow: 3,
									height: 400,
									objectFit: 'cover',
								}}
							/>
						</AnimateIn>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<AnimateIn type="fade-left">
							<SectionHeader
								align="left"
								subtitle="RELAX & RECHARGE"
								title="Fully Licensed Bar & Entertainment"
								description="The Short Grass isn't just about golf. It's a place to unwind, match your swing with a refreshing drink, and catch the latest live sports action."
								sx={{ mb: 4 }}
							/>

							<Stack spacing={4} sx={{ mt: 4, mb: 4 }}>
								<Box sx={{ display: 'flex', gap: 2 }}>
									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: '50%',
											bgcolor: theme.palette.grey[50],
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: theme.palette.primary.main,
											flexShrink: 0,
										}}
									>
										<LocalBar fontSize="medium" />
									</Box>
									<Box>
										<Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
											Premium Selection
										</Typography>
										<Typography variant="body2" color="text.secondary">
											From refreshing lagers and craft ales to premium spirits
											and soft drinks, our fully licensed bar has something for
											everyone.
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: 'flex', gap: 2 }}>
									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: '50%',
											bgcolor: theme.palette.grey[50],
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: theme.palette.primary.main,
											flexShrink: 0,
										}}
									>
										<LiveTv fontSize="medium" />
									</Box>
									<Box>
										<Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
											Live Sports
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Never miss a moment of the action. We have multiple large
											4K screens showing Sky Sports and TNT Sports.
										</Typography>
									</Box>
								</Box>
							</Stack>

							<Box>
								<Button
									variant="outlined"
									color="primary"
									size="large"
									onClick={() => (window.location.href = '/contact')}
									sx={{ borderRadius: 2, px: 4 }}
								>
									Reserve a Table
								</Button>
							</Box>
						</AnimateIn>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default BarAndEntertainment;
