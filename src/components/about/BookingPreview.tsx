import { Box, Container, Typography, useTheme, alpha } from '@mui/material';
import { AnimateIn } from '@common';
import BookingSteps from '../landing/BookingSteps';

const BookingPreview = () => {
	const theme = useTheme();

	return (
		<Box
			component="section"
			sx={{
				py: { xs: 8, md: 12 },
				background: `linear-gradient(180deg, ${
					theme.palette.background.paper
				} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<Container maxWidth="lg">
				<Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
					<AnimateIn type="fade-up">
						<Typography
							variant="title"
							sx={{
								fontWeight: 800,
								mb: 4,
							}}
						>
							How It Works
						</Typography>
						<Typography
							variant="h6"
							color="text.secondary"
							sx={{
								maxWidth: 600,
								mx: 'auto',
								fontWeight: 400,
								lineHeight: 1.6,
							}}
						>
							Book your next session in three simple steps. We've streamlined
							the process so you can spend less time booking and more time
							playing.
						</Typography>
					</AnimateIn>
				</Box>
				<BookingSteps />
			</Container>
		</Box>
	);
};

export default BookingPreview;
