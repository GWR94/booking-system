import { Box, Typography, Button, useTheme, Stack } from '@mui/material';
import { Diamond } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Logo, AnimateIn } from '@ui';

const HeroContent = () => {
	const navigate = useNavigate();
	const theme = useTheme();

	return (
		<Box>
			<Box
				sx={{
					display: { xs: 'none', md: 'flex' },
					alignItems: 'center',
					justifyContent: 'center',
					mb: { xs: 0, md: 4 },
				}}
			>
				<AnimateIn type="fade-right">
					<Logo logoOnly sx={{ height: 100 }} />
				</AnimateIn>
			</Box>
			<Typography
				variant="h2"
				sx={{
					fontWeight: 700,
					display: 'block',
					mb: 2,
					textShadow: '0px 2px 4px rgba(0,0,0,0.25)',
					fontSize: { xs: '2.5rem', md: '3.5rem' },
				}}
			>
				<AnimateIn type="fade-right">The Short Grass.</AnimateIn>
			</Typography>

			<Typography
				variant="h5"
				component="h3"
				gutterBottom
				sx={{
					fontWeight: 400,
					mb: 3,
					opacity: 0.9,
				}}
			>
				<AnimateIn type="fade-right">
					Indoor Golf Simulator Experience in the Heart of Maidstone
				</AnimateIn>
			</Typography>
			<AnimateIn type="fade-right" delay={0.4}>
				<Typography
					variant="body1"
					sx={{
						mb: 4,
						lineHeight: 1.7,
						opacity: 0.85,
						fontWeight: 400,
					}}
				>
					Practice, play, and improve your golf game year-round in our
					state-of-the-art simulator facility. Experience premium TrackMan
					technology, play world-class courses, and take your game to the next
					level regardless of weather conditions.
				</Typography>

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
					<Button
						variant="outlined"
						color="accent"
						size="large"
						onClick={() => navigate('/membership')}
						startIcon={<Diamond />}
						sx={{
							px: 4,
							py: 1.5,
							fontWeight: 600,
							borderRadius: 2,
							borderWidth: 2,
							background: 'rgba(255, 215, 0, 0.1)',
							borderColor: theme.palette.accent.main,
							'&:hover': {
								background: 'rgba(255, 215, 0, 0.2)',
								borderWidth: 2,
							},
						}}
					>
						View Plans
					</Button>
				</Stack>

				<Typography
					variant="caption"
					sx={{
						display: 'block',
						mt: 2,
						opacity: 0.8,
						fontStyle: 'italic',
					}}
				>
					Secure your monthly practice time with{' '}
					<strong>Par, Birdie & Hole-In-One</strong> memberships including 5, 10
					or 15 hours of simulator access.
				</Typography>
			</AnimateIn>
		</Box>
	);
};

export default HeroContent;
