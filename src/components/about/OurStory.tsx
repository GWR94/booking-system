import { Business } from '@mui/icons-material';
import {
	Grid2 as Grid,
	Box,
	Typography,
	Paper,
	Container,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

const OurStory = () => {
	const theme = useTheme();
	return (
		<Box sx={{ backgroundColor: alpha(theme.palette.accent.light, 0.5) }}>
			<Container sx={{ py: 8 }}>
				<Grid container spacing={6} sx={{ py: 6 }}>
					<Grid size={{ xs: 12, md: 7 }}>
						<Box
							sx={{
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
							}}
						>
							<Typography
								variant="h4"
								component="h2"
								gutterBottom
								sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
							>
								Our Story
							</Typography>
							<Typography variant="body1" gutterBottom>
								Founded in 2018, GWR Golf Simulators was born from a simple
								idea: to make the joy of golf accessible year-round, regardless
								of weather or daylight. Our founder, Michael Wright, a former
								PGA professional, recognized the need for a premium indoor golf
								experience in Maidstone that would combine cutting-edge
								technology with the authentic feel of the game.
							</Typography>
							<Typography variant="body1" gutterBottom>
								What began as a small facility with just two simulator bays has
								now expanded to our current location on High Street, featuring
								four state-of-the-art TrackMan 4 simulator bays, a dedicated
								coaching area, and a comfortable lounge space where golfers can
								relax before or after their sessions.
							</Typography>
							<Typography variant="body1" gutterBottom>
								Our mission is simple: to provide an unparalleled indoor golf
								experience that helps golfers of all skill levels improve their
								game, have fun, and connect with like-minded enthusiasts in a
								welcoming environment.
							</Typography>

							<Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
								<Business color="primary" sx={{ mr: 1.5 }} />
								<Typography variant="subtitle1" fontWeight={500}>
									Established 2018 • High Street, Maidstone
								</Typography>
							</Box>
						</Box>
					</Grid>
					<Grid size={{ xs: 12, md: 5 }}>
						<Paper
							elevation={0}
							sx={{
								borderRadius: 2,
								overflow: 'hidden',
								height: '100%',
								minHeight: 400,
								border: `1px solid ${theme.palette.divider}`,
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
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default OurStory;
