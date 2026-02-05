import { Box, Container, Typography, useTheme, alpha } from '@mui/material';
import { AnimateIn } from '@ui';
import BookingSteps from './BookingSteps';

const BookingPreview = () => {
	const theme = useTheme();

	return (
		<Box
			component="section"
			sx={{
				py: { xs: 8, md: 10 },
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<Container maxWidth="lg">
				<Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
					<AnimateIn type="fade-up">
						<Typography
							variant="title"
							sx={{
								color: theme.palette.primary.main,
								fontWeight: 600,
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
				<AnimateIn type="fade-up" delay={0.2}>
					<BookingSteps />
				</AnimateIn>
			</Container>
		</Box>
	);
};

export default BookingPreview;
