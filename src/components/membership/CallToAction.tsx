import { Box, Button, Typography, useTheme } from '@mui/material';

const CallToAction = () => {
	const theme = useTheme();
	return (
		<Box sx={{ textAlign: 'center', mt: 8 }}>
			<Typography
				variant="h4"
				component="h2"
				gutterBottom
				sx={{
					fontWeight: 700,
					color: theme.palette.primary.main,
					mb: 4,
				}}
			>
				Ready to Elevate Your Game?
			</Typography>
			<Button
				variant="contained"
				color="primary"
				size="large"
				sx={{
					px: 6,
					py: 2,
					borderRadius: 3,
					fontSize: '1.2rem',
				}}
				onClick={() => {
					const tiersSection = document.getElementById('membership-tiers');
					if (tiersSection) {
						const offset = 100; // Adjustment for navbar height
						const elementPosition =
							tiersSection.getBoundingClientRect().top + window.scrollY;
						const offsetPosition = elementPosition - offset;

						window.scrollTo({
							top: offsetPosition,
							behavior: 'smooth',
						});
					}
				}}
			>
				Join Now
			</Button>
		</Box>
	);
};

export default CallToAction;
