import { Business } from '@mui/icons-material';
import {
	Grid2 as Grid,
	Box,
	Typography,
	Paper,
	Container,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material';
import { AnimateIn } from '@ui';

const OurStory = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				py: 8,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
					<Grid size={{ xs: 12, md: 7 }} order={{ xs: 2, md: 2 }}>
						<AnimateIn type="fade-right">
							<Typography
								variant="h3"
								component="h2"
								sx={{
									fontWeight: 700,
									mb: 4,
									background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.dark})`,
									backgroundClip: 'text',
									textFillColor: 'transparent',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
								}}
							>
								<Box component="span">Play. </Box>
								<Box component="span">Practice. </Box>
								<Box component="span">Perform.</Box>
							</Typography>

							<Typography
								variant="body1"
								component="p"
								sx={{ fontSize: '1.1rem', color: 'text.secondary', mb: 3 }}
							>
								The Short Grass didn't start in a boardroom; it started on the
								range. Frustrated by the limitations of British weather and the
								lack of accessible elite-level technology, we asked a simple
								question: "Why can't we play the world's best courses on a
								Tuesday night in February?"
							</Typography>

							<Typography
								variant="body1"
								component="p"
								sx={{ color: 'text.secondary', mb: 3 }}
							>
								Our founder, Michael Wright, envisioned a space that stripped
								away the stuffiness of traditional clubs while keeping the
								respect for the game. He wanted to build a sanctuary where
								technology enhances the experience, not complicates it.
							</Typography>

							<Typography
								variant="body1"
								component="p"
								sx={{ color: 'text.secondary', mb: 4 }}
							>
								Today, The Short Grass is more than just a simulator venue. It's
								a community of passionate golfers, from scratch players refining
								their numbers to beginners finding their swing. With four
								state-of-the-art TrackMan bays and a vibrant lounge, we're
								defining the future of indoor golf in Maidstone.
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
									elevation={3}
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
											boxShadow: 6,
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
