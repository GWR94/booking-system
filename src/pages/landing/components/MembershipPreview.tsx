import {
	Box,
	Container,
	Typography,
	Grid2 as Grid,
	Card,
	CardContent,
	CardActions,
	Button,
	useTheme,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AnimateIn } from '@ui';

const membershipTiers = [
	{
		name: 'Par',
		price: '£199.99/month',
		perks: [
			'5 hours of simulator access per month',
			'Access to weekday bookings only',
			'10% discount on additional bookings',
			'10% discount on additional bookings',
		],
		id: 'PAR',
		color: '#5a5a5aff',
	},
	{
		name: 'Birdie',
		price: '£299.99/month',
		perks: [
			'10 hours of simulator access per month',
			'Access to weekday and weekend bookings',
			'15% discount on additional bookings',
		],
		id: 'BIRDIE',
		color: '#D22B2B',
	},
	{
		name: 'Hole-In-One',
		price: '£399.99/month',
		perks: [
			'15 hours of simulator access per month',
			'Access to all booking times',
			'20% discount on additional bookings',
		],
		id: 'HOLEINONE',
		color: '#FFD700',
	},
];

const MembershipPreview = () => {
	const theme = useTheme();
	const navigate = useNavigate();

	return (
		<Box sx={{ py: 10, bgcolor: theme.palette.background.default }}>
			<Container maxWidth="lg">
				<Box sx={{ textAlign: 'center', mb: 8 }}>
					<AnimateIn type="fade-up">
						<Typography
							variant="title"
							component="h2"
							gutterBottom
							sx={{ fontWeight: 700, mb: 4 }}
						>
							Flexible Membership Plans
						</Typography>
						<Typography
							variant="h6"
							color="text.secondary"
							sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400 }}
						>
							Join The Short Grass community and enjoy regular access to our
							state-of-the-art simulators at the best rates.
						</Typography>
					</AnimateIn>
				</Box>

				<Grid container spacing={4} justifyContent="center">
					{membershipTiers.map((tier, index) => (
						<Grid size={{ xs: 12, md: 4 }} key={index}>
							<AnimateIn
								type="fade-up"
								delay={index * 0.1}
								style={{ height: '100%' }}
							>
								<Card
									elevation={tier.id === 'HOLEINONE' ? 8 : 2}
									sx={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										borderRadius: 4,
										position: 'relative',
										overflow: 'visible',
										border: `2px solid ${tier.color}`,
										transition: 'transform 0.3s ease',
										'&:hover': {
											transform: 'translateY(-8px)',
										},
									}}
								>
									{tier.id === 'HOLEINONE' && (
										<Box
											sx={{
												position: 'absolute',
												top: -12,
												left: '50%',
												transform: 'translateX(-50%)',
												bgcolor: '#FFD700',
												color: '#000',
												px: 2,
												py: 0.5,
												borderRadius: 2,
												fontWeight: 700,
												fontSize: '0.875rem',
												boxShadow: 2,
											}}
										>
											BEST VALUE
										</Box>
									)}
									<CardContent sx={{ flexGrow: 1, p: 4 }}>
										<Typography
											variant="h5"
											component="h3"
											gutterBottom
											sx={{
												fontWeight: 700,
												color: tier.color,
											}}
										>
											{tier.name}
										</Typography>
										<Typography
											variant="h4"
											gutterBottom
											sx={{ fontWeight: 700, mb: 3 }}
										>
											{tier.price}
										</Typography>
										<Box>
											{tier.perks.map((perk, i) => (
												<Box
													key={i}
													sx={{
														display: 'flex',
														alignItems: 'flex-start',
														mb: 2,
													}}
												>
													<CheckCircleOutline
														sx={{
															mr: 1.5,
															color: theme.palette.success.main,
															fontSize: 20,
															mt: 0.5,
														}}
													/>
													<Typography variant="body2" color="text.secondary">
														{perk}
													</Typography>
												</Box>
											))}
										</Box>
									</CardContent>
									<CardActions sx={{ p: 4, pt: 0 }}>
										<Button
											variant={
												tier.id === 'HOLEINONE' ? 'contained' : 'outlined'
											}
											color="primary"
											fullWidth
											size="large"
											onClick={() => navigate('/membership')}
											sx={{ borderRadius: 2 }}
										>
											View Details
										</Button>
									</CardActions>
								</Card>
							</AnimateIn>
						</Grid>
					))}
				</Grid>

				<Box sx={{ textAlign: 'center', mt: 6 }}>
					<Button
						variant="text"
						color="inherit"
						onClick={() => navigate('/membership')}
						sx={{ fontSize: '1rem', textTransform: 'none' }}
					>
						Compare all membership benefits →
					</Button>
				</Box>
			</Container>
		</Box>
	);
};

export default MembershipPreview;
