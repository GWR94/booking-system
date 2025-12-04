import {
	Container,
	Typography,
	Button,
	Box,
	Grid2 as Grid,
	Stack,
	useTheme,
	alpha,
	Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { SportsGolf, EventAvailable, PhoneInTalk } from '@mui/icons-material';

const CallToAction = () => {
	const theme = useTheme();
	const navigate = useNavigate();

	return (
		<Box
			sx={{
				background: `linear-gradient(to bottom, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
				color: theme.palette.primary.contrastText,
				py: { xs: 8, md: 12 },
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 5 }}>
				<Grid container spacing={4} alignItems="center">
					<Grid size={{ xs: 12, md: 7 }}>
						<Typography
							variant="h2"
							sx={{
								fontWeight: 700,
								mb: 2,
								fontSize: { xs: '2.5rem', md: '3rem' },
								textShadow: '0 2px 10px rgba(0,0,0,0.2)',
							}}
						>
							Ready to Improve Your Golf Game?
						</Typography>

						<Typography
							variant="h5"
							sx={{
								mb: 4,
								fontWeight: 400,
								opacity: 0.9,
								maxWidth: 600,
							}}
						>
							Experience TrackMan technology, play world-class courses, and
							elevate your skills year-round.
						</Typography>

						<Stack direction="row" spacing={3} sx={{ mb: 5 }}>
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
						</Stack>
					</Grid>

					<Grid
						size={{ xs: 12, md: 5 }}
						sx={{ display: { xs: 'none', md: 'block' } }}
					>
						<Box
							sx={{
								position: 'relative',
								backgroundColor: alpha(theme.palette.common.white, 0.08),
								borderRadius: 3,
								p: 4,
								boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
								border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
								backdropFilter: 'blur(8px)',
							}}
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
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default CallToAction;
