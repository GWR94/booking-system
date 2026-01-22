import { AnimateIn } from '@ui';
import {
	CalendarMonth,
	Timer,
	GolfCourse,
	CheckCircleOutline,
} from '@mui/icons-material';
import {
	Grid2 as Grid,
	Card,
	Typography,
	Box,
	Stack,
	alpha,
	useTheme,
} from '@mui/material';

const BookingSteps = () => {
	const theme = useTheme();

	const bookingSteps = [
		{
			icon: <CalendarMonth sx={{ fontSize: 48 }} />,
			title: 'Select a Date',
			description:
				'Choose from our real-time calendar with availability up to 30 days in advance.',
			color: theme.palette.primary.main,
			feature: 'Mornings to evenings',
		},
		{
			icon: <Timer sx={{ fontSize: 48 }} />,
			title: 'Choose a Slot',
			description:
				'Pick your preferred time. Sessions are available hourly from early morning to late night.',
			color: theme.palette.secondary.main,
			feature: 'Hourly sessions',
		},
		{
			icon: <GolfCourse sx={{ fontSize: 48 }} />,
			title: 'Confirm & Play',
			description:
				'Instant confirmation. No booking fees. Just show up and enjoy your game.',
			color: theme.palette.accent.main,
			feature: 'No booking fees',
		},
	];

	return (
		<Grid container spacing={{ xs: 6, md: 4 }} justifyContent="center">
			{bookingSteps.map((step, index) => (
				<Grid size={{ xs: 12, md: 4 }} key={index}>
					<AnimateIn
						type="fade-up"
						delay={index * 0.2}
						style={{ height: '100%' }}
					>
						<Card
							sx={{
								position: 'relative',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								borderRadius: 3,
								boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
								transition: 'transform 0.3s ease, box-shadow 0.3s ease',
								p: 4,
								'&:hover': {
									transform: 'translateY(-8px)',
									boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
								},
							}}
						>
							<Typography
								variant="h1"
								sx={{
									position: 'absolute',
									top: 10,
									right: 20,
									fontSize: '5rem',
									fontWeight: 900,
									color: alpha(step.color, 0.15),
									lineHeight: 1,
									userSelect: 'none',
									pointerEvents: 'none',
								}}
							>
								0{index + 1}
							</Typography>

							<Box
								sx={{
									display: 'flex',
									borderRadius: '50%',
									backgroundColor: alpha(step.color, 0.1),
									color: step.color,
									width: 50,
									height: 50,
									mb: 3,
									alignItems: 'center',
									justifyContent: 'center',
									position: 'relative',
								}}
							>
								{step.icon}
							</Box>

							<Typography
								variant="h5"
								gutterBottom
								sx={{ fontWeight: 700, mb: 2 }}
							>
								{step.title}
							</Typography>
							<Typography
								variant="body1"
								color="text.secondary"
								sx={{ mb: 3, lineHeight: 1.6 }}
							>
								{step.description}
							</Typography>

							<Stack
								direction="row"
								spacing={1}
								justifyContent="center"
								alignItems="center"
								sx={{
									mt: 'auto',
									opacity: 0.8,
									fontSize: '0.875rem',
									color: theme.palette.text.secondary,
								}}
							>
								<CheckCircleOutline
									fontSize="small"
									sx={{ color: step.color }}
								/>
								<Typography variant="body2" fontWeight={500}>
									{step.feature}
								</Typography>
							</Stack>
						</Card>
					</AnimateIn>
				</Grid>
			))}
		</Grid>
	);
};

export default BookingSteps;
