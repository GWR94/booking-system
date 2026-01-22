import { Box, Typography, Button, useTheme, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AnimateIn } from '@ui';

const Intro = () => {
	const theme = useTheme();

	return (
		<Container
			maxWidth="lg"
			sx={{
				pt: { xs: 8, md: 10 },
			}}
		>
			<AnimateIn type="fade-up">
				<Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
					<Typography
						variant="h3"
						component="h2"
						gutterBottom
						sx={{ fontWeight: 700 }}
					>
						The Short Grass.
					</Typography>

					<Typography
						variant="h6"
						color="text.secondary"
						sx={{ fontWeight: 400, mb: 4, lineHeight: 1.6 }}
					>
						Welcome to The Short Grass, Maidstone's premier indoor facility. We
						combine state-of-the-art technology with a welcoming atmosphere to
						create the ultimate golfing environment for players of all levels.
					</Typography>

					<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
						<Button
							variant="contained"
							size="large"
							component={RouterLink}
							to="/book"
							sx={{
								fontWeight: 600,
								px: 4,
								py: 1.5,
								borderRadius: 2,
								boxShadow: theme.shadows[4],
							}}
						>
							Book a Session
						</Button>
						<Button
							variant="outlined"
							size="large"
							component={RouterLink}
							to="/contact"
							sx={{
								fontWeight: 600,
								px: 4,
								py: 1.5,
								borderRadius: 2,
								borderWidth: 2,
								'&:hover': { borderWidth: 2 },
							}}
						>
							Contact Us
						</Button>
					</Box>
				</Box>
			</AnimateIn>
		</Container>
	);
};

export default Intro;
