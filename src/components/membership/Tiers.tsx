import TestPaymentNotice from '@components/checkout/TestPaymentNotice';
import { useSnackbar } from '@context';
import { useAuth } from '@hooks';
import { LoadingButton } from '@mui/lab';
import {
	Grid2 as Grid,
	Box,
	Card,
	CardContent,
	Typography,
	CardActions,
	Button,
	useTheme,
} from '@mui/material';
import axios from '@utils/axiosConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const membershipTiers = [
	{
		name: 'Bronze',
		price: '£199.99/month',
		perks: [
			'5 hours of simulator access per month',
			'Access to weekday bookings only',
			'10% discount on additional bookings',
		],
		color: 'bronze',
	},
	{
		name: 'Silver',
		price: '£299.99/month',
		perks: [
			'10 hours of simulator access per month',
			'Access to weekday and weekend bookings',
			'15% discount on additional bookings',
			'Priority booking slots',
		],
		color: 'silver',
	},
	{
		name: 'Gold',
		price: '£499.99 / month',
		perks: [
			'15 hours of simulator access per month',
			'Access to all booking times',
			'20% discount on additional bookings',
			'Priority booking slots',
			'Free monthly coaching session',
		],
		color: 'gold',
	},
];

const Tiers = () => {
	const theme = useTheme();
	const { showSnackbar } = useSnackbar();
	const [loadingTier, setLoadingTier] = useState<string | null>(null);
	const { isAuthenticated, user } = useAuth();
	const navigate = useNavigate();

	const handleSubscribe = async (tierName: string) => {
		if (!isAuthenticated) {
			showSnackbar('You must be logged in to subscribe', 'warning');
			navigate('/login');
			return;
		}
		try {
			setLoadingTier(tierName);
			const response = await axios.post(
				'/api/user/subscription/create-session',
				{
					tier: tierName,
				},
			);

			setLoadingTier(null);

			if (response.data.url) {
				window.location.href = response.data.url;
			}
		} catch (error) {
			setLoadingTier(null);
			showSnackbar('Error starting subscription', 'error');
			console.error('Error starting subscription:', error);
		}
	};

	return (
		<Grid container spacing={4} sx={{ mb: 8 }} id="membership-tiers">
			{membershipTiers.map((tier, index) => (
				<Grid size={{ xs: 12, md: 4 }} key={index}>
					<Box sx={{ height: '100%' }}>
						<Card
							elevation={3}
							sx={{
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								borderRadius: 3,
								overflow: 'hidden',
								border: `2px solid ${
									tier.color === 'gold'
										? '#FFD700'
										: tier.color === 'silver'
										? '#C0C0C0'
										: '#CD7F32'
								}`,
								transition: 'transform 0.3s ease, box-shadow 0.3s ease',
								'&:hover': {
									transform: 'translateY(-8px)',
									boxShadow: 6,
								},
							}}
						>
							<CardContent
								sx={{
									flexGrow: 1,
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
								}}
							>
								<Typography
									variant="h5"
									component="h2"
									gutterBottom
									sx={{
										fontWeight: 700,
										color:
											tier.color === 'gold'
												? '#FFD700'
												: tier.color === 'silver'
												? '#C0C0C0'
												: '#CD7F32',
									}}
								>
									{tier.name}
								</Typography>
								<Typography
									variant="h6"
									sx={{
										fontWeight: 600,
										color: theme.palette.text.primary,
										mb: 2,
									}}
								>
									{tier.price}
								</Typography>
								<Box>
									{tier.perks.map((perk, i) => (
										<Typography
											key={i}
											variant="body2"
											color="text.secondary"
											sx={{ mb: 1 }}
										>
											• {perk}
										</Typography>
									))}
								</Box>
							</CardContent>
							<CardActions sx={{ justifyContent: 'center', pb: 2 }}>
								<LoadingButton
									variant="outlined"
									color="inherit"
									loading={loadingTier === tier.name.toUpperCase()}
									sx={{
										px: 4,
										borderRadius: 2,
										borderColor:
											tier.color === 'gold'
												? '#FFD700'
												: tier.color === 'silver'
												? '#C0C0C0'
												: '#CD7F32',
									}}
									onClick={() => handleSubscribe(tier.name.toUpperCase())}
									disabled={
										user?.membershipTier === tier.name.toUpperCase() &&
										user?.membershipStatus === 'active'
									}
								>
									{user?.membershipTier === tier.name.toUpperCase() &&
									user?.membershipStatus === 'active'
										? 'Current Plan'
										: `Choose ${tier.name}`}
								</LoadingButton>
							</CardActions>
						</Card>
					</Box>
				</Grid>
			))}
			<TestPaymentNotice membership />
		</Grid>
	);
};

export default Tiers;
