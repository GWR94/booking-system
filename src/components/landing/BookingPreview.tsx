import {
	Box,
	Container,
	Typography,
	Grid2 as Grid,
	Paper,
	Button,
	useTheme,
	alpha,
	Card,
	CardContent,
	Stack,
	Chip,
} from '@mui/material';
import {
	CalendarMonth,
	Timer,
	ArrowForward,
	Check,
	DevicesOutlined,
	GolfCourse,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const BookingPreview = () => {
	const theme = useTheme();
	const navigate = useNavigate();

	// Step data with enhanced descriptions
	const bookingSteps = [
		{
			icon: (
				<CalendarMonth
					sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }}
				/>
			),
			title: 'Select a Date',
			description:
				'Choose from our flexible calendar with availability up to 30 days in advance.',
			features: ['Real-time availability', 'No booking fees'],
			color: theme.palette.primary.main,
		},
		{
			icon: (
				<Timer
					sx={{ fontSize: 60, color: theme.palette.secondary.main, mb: 2 }}
				/>
			),
			title: 'Choose a Time Slot',
			description:
				'Book by the hour with options from morning to evening to fit your schedule.',
			features: [
				'Hour-long sessions',
				'Multiple bay options',
				'Book multiple sessions',
			],
			color: theme.palette.secondary.main,
		},
		{
			icon: (
				<GolfCourse
					sx={{ fontSize: 60, color: theme.palette.accent.main, mb: 2 }}
				/>
			),
			title: 'Confirm and Play',
			description:
				'Secure your booking instantly and get ready to improve your game.',
			features: ['Instant confirmation', 'Easy rescheduling'],
			color: theme.palette.accent.main,
		},
	];

	return (
		<Box
			id="booking-preview-section"
			sx={{
				py: { xs: 8, md: 12 },
				position: 'relative',
				background: `linear-gradient(to bottom, ${theme.palette.primary.light} 0%,${theme.palette.primary.main} 100%)`,
				overflow: 'hidden',
				'&::after': {
					content: '""',
					position: 'absolute',
					bottom: 0,
					left: 0,
					width: '100%',
					height: '40%',
					background: `radial-gradient(ellipse at 50% 100%, ${alpha(
						theme.palette.accent.light,
						0.15,
					)} 0%, transparent 70%)`,
					zIndex: 1,
					pointerEvents: 'none',
				},
			}}
		>
			<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
				<Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
					<Typography
						variant="h3"
						gutterBottom
						sx={{
							fontWeight: 700,
							color: theme.palette.primary.main,
							fontSize: { xs: '2.5rem', md: '3rem' },
						}}
					>
						Easy Online Booking
					</Typography>

					<Typography
						variant="h6"
						color="text.secondary"
						sx={{
							maxWidth: 700,
							mx: 'auto',
							fontWeight: 400,
							mb: 3,
						}}
					>
						Book your simulator session in seconds with our intuitive online
						reservation system
					</Typography>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							gap: 1,
							mb: 6,
							flexWrap: 'wrap',
						}}
					>
						<Chip
							icon={<Check fontSize="small" />}
							label="Real-time Availability"
							color="accent"
							variant="outlined"
							sx={{ fontWeight: 500 }}
						/>
						<Chip
							icon={<DevicesOutlined fontSize="small" />}
							label="Mobile Friendly"
							color="accent"
							variant="outlined"
							sx={{ fontWeight: 500 }}
						/>
						<Chip
							icon={<Check fontSize="small" />}
							label="Instant Confirmation"
							color="accent"
							variant="outlined"
							sx={{ fontWeight: 500 }}
						/>
					</Box>
				</Box>

				<Grid container spacing={4} justifyContent="center">
					{bookingSteps.map((step, index) => (
						<Grid size={{ xs: 12, md: 4 }} key={index}>
							<Paper
								elevation={4}
								sx={{
									p: 4,
									borderRadius: '0 0 3px 3px',
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									mb: 8,
									transition: 'all 0.3s ease',
									position: 'relative',
									'&:hover': {
										transform: 'translateY(-10px)',
										boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
										'& .step-number': {
											backgroundColor: step.color,
											color: '#fff',
										},
									},
									overflow: 'visible',
									'&::before': {
										content: '""',
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										height: '4px',
										backgroundColor: step.color,
									},
								}}
							>
								<Box
									className="step-number"
									sx={{
										position: 'absolute',
										top: -15,
										left: 25,
										width: 30,
										height: 30,
										borderRadius: '50%',
										backgroundColor: theme.palette.background.paper,
										color: step.color,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontWeight: 700,
										transition: 'all 0.3s ease',
										border: `2px solid ${step.color}`,
									}}
								>
									{index + 1}
								</Box>
								{step.icon}
								<Typography
									variant="h5"
									component="h3"
									gutterBottom
									sx={{
										fontWeight: 700,
										color: theme.palette.text.primary,
										mb: 1,
									}}
								>
									{step.title}
								</Typography>

								<Typography
									align="center"
									sx={{
										mb: 2,
										color: theme.palette.text.secondary,
									}}
								>
									{step.description}
								</Typography>

								<Stack
									direction="column"
									spacing={1}
									sx={{ m: 'auto', width: '100%' }}
								>
									{step.features.map((feature, i) => (
										<Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
											<Check
												fontSize="small"
												sx={{
													color: step.color,
													mr: 1,
													opacity: 0.9,
												}}
											/>
											<Typography
												variant="body2"
												sx={{
													fontWeight: 500,
													color: theme.palette.text.secondary,
												}}
											>
												{feature}
											</Typography>
										</Box>
									))}
								</Stack>
							</Paper>
						</Grid>
					))}
				</Grid>

				<Box
					sx={{
						textAlign: 'center',
						mt: 5,
						position: 'relative',
						zIndex: 3,
					}}
				>
					<Card
						elevation={4}
						sx={{
							maxWidth: 600,
							mx: 'auto',
							p: 2,
							borderTop: `4px solid ${theme.palette.primary.light}`,
							borderBottom: `4px solid ${theme.palette.primary.light}`,
							mt: { xs: 4, md: -9 },
							borderRadius: 0,
							boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
						}}
					>
						<CardContent>
							<Typography
								variant="h5"
								component="h3"
								gutterBottom
								sx={{
									fontWeight: 600,
									textAlign: 'center',
								}}
							>
								Ready to book your session?
							</Typography>

							<Typography
								variant="body1"
								sx={{
									mb: 3,
									textAlign: 'center',
								}}
							>
								Secure your preferred time slot now and start improving your
								golf game
							</Typography>

							<Button
								variant="contained"
								color="secondary"
								endIcon={<ArrowForward />}
								onClick={() => navigate('/book')}
								sx={{
									px: 3,
									py: 1,
									fontSize: '1rem',
									fontWeight: 600,
									borderRadius: 2,
									boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
									mx: 'auto',
									mb: 1,
								}}
							>
								Book a Session Now
							</Button>

							<Typography
								variant="body2"
								sx={{
									textAlign: 'center',
									mt: 1,
								}}
							>
								No sign-up required • Easy rescheduling available
							</Typography>
						</CardContent>
					</Card>
				</Box>
			</Container>
		</Box>
	);
};

export default BookingPreview;
