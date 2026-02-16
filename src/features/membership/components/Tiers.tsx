'use client';

import { TestPaymentNotice } from '@features/checkout/components';
import { useSnackbar, useUI } from '@context';
import { useAuth } from '@hooks';
import { LoadingButton } from '@ui';
import {
	Grid2 as Grid,
	Box,
	Card,
	CardContent,
	Typography,
	CardActions,
	useTheme,
} from '@mui/material';
import { createSubscriptionSession } from '@api';
import { useState } from 'react';

const membershipTiers = [
	{
		id: 'PAR',
		name: 'Par',
		price: '£199.99/month',
		perks: [
			'5 hours of simulator access per month',
			'Access to weekday bookings only',
			'10% discount on additional bookings',
		],
		color: '#000000', // Black (Par - Neutral)
	},
	{
		id: 'BIRDIE',
		name: 'Birdie',
		price: '£299.99/month',
		perks: [
			'10 hours of simulator access per month',
			'Access to weekday and weekend bookings',
			'15% discount on additional bookings',
			'Priority booking slots',
		],
		color: '#D22B2B', // Golf Scorecard Red (Birdie - Circle)
	},
	{
		id: 'HOLEINONE',
		name: 'Hole-In-One',
		price: '£399.99/month',
		perks: [
			'15 hours of simulator access per month',
			'Access to all booking times',
			'20% discount on additional bookings',
			'Priority booking slots',
			'Free monthly coaching session',
		],
		color: '#FFD700', // Gold (Hole-In-One - Circle)
	},
];

const Tiers = () => {
	const theme = useTheme();
	const { showSnackbar } = useSnackbar();
	const { openAuthModal } = useUI();
	const [loadingTier, setLoadingTier] = useState<string | null>(null);
	const { isAuthenticated, user } = useAuth();

	const handleSubscribe = async (tierName: string) => {
		if (!isAuthenticated) {
			showSnackbar('You must be logged in to subscribe', 'warning');
			openAuthModal('login');
			return;
		}
		try {
			setLoadingTier(tierName);
			const response = await createSubscriptionSession(tierName);

			setLoadingTier(null);

			if (response.url) {
				window.location.href = response.url;
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
								border: `2px solid ${tier.color}`,
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
									justifyContent: 'space-evenly',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<Typography
										variant="h5"
										component="h2"
										gutterBottom
										sx={{
											fontWeight: 700,
											color: tier.color,
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
								</Box>

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
									loading={loadingTier === tier.id}
									sx={{
										px: 4,
										borderRadius: 2,
										borderColor: tier.color,
									}}
									onClick={() => handleSubscribe(tier.id)}
									disabled={
										user?.membershipTier === tier.id &&
										user?.membershipStatus === 'ACTIVE'
									}
								>
									{user?.membershipTier === tier.id &&
									user?.membershipStatus === 'ACTIVE'
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
