import {
	StarBorder,
	EventAvailable,
	SportsGolf,
	Business,
	Diversity3,
	EmojiEvents,
} from '@mui/icons-material';
import { useTheme } from '@mui/material';

import { Paper, Typography, Grid2 as Grid, Box } from '@mui/material';

const Features = () => {
	const theme = useTheme();
	return (
		<Paper
			elevation={0}
			sx={{
				p: 4,
				mb: 8,
				borderRadius: 2,
				border: `1px solid ${theme.palette.divider}`,
			}}
		>
			<Typography
				variant="h4"
				component="h2"
				gutterBottom
				sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 4 }}
			>
				Why Choose The Short Grass?
			</Typography>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Box sx={{ display: 'flex', mb: 3 }}>
						<StarBorder color="secondary" sx={{ fontSize: 22, mr: 1.5 }} />
						<Box>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
								Premium Equipment
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Experience golf on TrackMan 4 systems, the same technology used
								by top professionals worldwide.
							</Typography>
						</Box>
					</Box>
				</Grid>

				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Box sx={{ display: 'flex', mb: 3 }}>
						<EventAvailable color="secondary" sx={{ fontSize: 22, mr: 1.5 }} />
						<Box>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
								Convenient Booking
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Reserve your bay online anytime with our easy-to-use booking
								system for hassle-free scheduling.
							</Typography>
						</Box>
					</Box>
				</Grid>

				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Box sx={{ display: 'flex', mb: 3 }}>
						<SportsGolf color="secondary" sx={{ fontSize: 22, mr: 1.5 }} />
						<Box>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
								All-Weather Golf
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Play rain or shine, day or night, in a climate-controlled
								environment all year round.
							</Typography>
						</Box>
					</Box>
				</Grid>

				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Box sx={{ display: 'flex', mb: { xs: 3, md: 0 } }}>
						<Business color="secondary" sx={{ fontSize: 22, mr: 1.5 }} />
						<Box>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
								Central Location
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Conveniently located on High Street in Maidstone with easy
								access to parking and public transport.
							</Typography>
						</Box>
					</Box>
				</Grid>

				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Box sx={{ display: 'flex', mb: { xs: 3, md: 0 } }}>
						<Diversity3 color="secondary" sx={{ fontSize: 22, mr: 1.5 }} />
						<Box>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
								Community Focus
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Join a welcoming community of golf enthusiasts through our
								regular events and leagues.
							</Typography>
						</Box>
					</Box>
				</Grid>

				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Box sx={{ display: 'flex' }}>
						<EmojiEvents color="secondary" sx={{ fontSize: 22, mr: 1.5 }} />
						<Box>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
								Data-Driven Improvement
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Track your progress with detailed performance statistics after
								every session.
							</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default Features;
