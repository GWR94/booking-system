import { Box, Typography, useTheme } from '@mui/material';

const HowItWorks = () => {
	const theme = useTheme();
	return (
		<Box sx={{ mb: 4 }}>
			<Typography
				variant="h4"
				component="h2"
				gutterBottom
				sx={{
					fontWeight: 700,
					color: theme.palette.primary.main,
				}}
			>
				How It Works
			</Typography>
			<Typography
				variant="body1"
				color="text.secondary"
				gutterBottom
				sx={{
					fontWeight: 400,
				}}
			>
				Select a membership plan that suits your needs, sign up, and enjoy
				exclusive access to our premium golf simulators. Your membership renews
				automatically every month, and you can cancel anytime.
			</Typography>
			<Typography
				variant="body1"
				color="text.secondary"
				gutterBottom
				sx={{
					fontWeight: 400,
				}}
			>
				Once you have an active membership, all you need to do is sign in and
				you will be able to book your simulator sessions included with your
				membership instantly.
			</Typography>
		</Box>
	);
};

export default HowItWorks;
