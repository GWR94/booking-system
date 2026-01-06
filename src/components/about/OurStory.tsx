import { Business, HistoryEdu } from '@mui/icons-material';
import {
	Grid2 as Grid,
	Box,
	Typography,
	Paper,
	Container,
	Chip,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AnimateIn from '../common/AnimateIn';

const OurStory = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<Container>
				<Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
					<Grid size={{ xs: 12, md: 7 }} order={{ xs: 2, md: 2 }}>
						<AnimateIn type="fade-right">
							<Typography
								variant="h3"
								component="h2"
								sx={{
									fontWeight: 700,
									py: 3,
									background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.dark})`,
									backgroundClip: 'text',
									textFillColor: 'transparent',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
								}}
							>
								From a Simple Idea <br />
								<Box
									component="span"
									sx={{
										color: theme.palette.text.primary,
										WebkitTextFillColor: 'initial',
									}}
								>
									To a Premium Experience
								</Box>
							</Typography>

							<Typography
								variant="body1"
								component="p"
								sx={{ fontSize: '1.1rem', color: 'text.secondary', mb: 3 }}
							>
								Founded in 2018, GWR Golf Simulators was born from a simple
								idea: to make the joy of golf accessible year-round, regardless
								of weather or daylight.
							</Typography>

							<Typography
								variant="body1"
								component="p"
								sx={{ color: 'text.secondary', mb: 3 }}
							>
								Our founder, Michael Wright, a former PGA professional,
								recognized the need for a premium indoor golf experience in
								Maidstone that would combine cutting-edge technology with the
								authentic feel of the game.
							</Typography>

							<Typography
								variant="body1"
								component="p"
								sx={{ color: 'text.secondary', mb: 4 }}
							>
								What began as a small facility with just two simulator bays has
								now expanded to our current location on High Street, featuring
								four state-of-the-art TrackMan 4 simulator bays, a dedicated
								coaching area, and a comfortable lounge space.
							</Typography>

							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									p: 2,
									borderRadius: 2,
									bgcolor: alpha(theme.palette.primary.main, 0.05),
									border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
									width: 'fit-content',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										width: 40,
										height: 40,
										borderRadius: '50%',
										bgcolor: alpha(theme.palette.primary.main, 0.1),
										color: theme.palette.primary.main,
										mr: 2,
									}}
								>
									<Business />
								</Box>
								<Box>
									<Typography
										variant="caption"
										display="block"
										color="text.secondary"
										sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
									>
										Established
									</Typography>
									<Typography variant="subtitle2" fontWeight={700}>
										2018 • High Street, Maidstone
									</Typography>
								</Box>
							</Box>
						</AnimateIn>
					</Grid>

					{/* Image Section */}
					<Grid size={{ xs: 12, md: 5 }} order={{ xs: 1, md: 1 }}>
						<AnimateIn type="fade-left" delay={0.2}>
							<Box sx={{ position: 'relative' }}>
								<Paper
									elevation={10}
									sx={{
										position: 'relative',
										borderRadius: 4,
										overflow: 'hidden',
										height: { xs: 300, md: 500 },
										width: '100%',
										zIndex: 1,
										transition: 'transform 0.3s ease-in-out',
										'&:hover': {
											transform: 'translateY(-5px)',
										},
									}}
								>
									<Box
										component="img"
										src="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
										alt="Golf simulator setup"
										sx={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
										}}
									/>
									<Box
										sx={{
											position: 'absolute',
											bottom: 0,
											left: 0,
											width: '100%',
											height: '40%',
											background:
												'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
										}}
									/>
								</Paper>
							</Box>
						</AnimateIn>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default OurStory;
