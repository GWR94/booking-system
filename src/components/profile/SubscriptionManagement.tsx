import React, { useState } from 'react';
import {
	Box,
	Typography,
	Button,
	Paper,
	Chip,
	Stack,
	CircularProgress,
	Grid2 as Grid,
	Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createPortalSession } from '@api';
import dayjs from 'dayjs';

interface SubscriptionManagementProps {
	user: any; // Ideally user interface
}

const TIER_DISPLAY_NAMES: { [key: string]: string } = {
	PAR: 'Par',
	BIRDIE: 'Birdie',
	HOLEINONE: 'Hole-In-One',
};

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
	user,
}) => {
	const theme = useTheme();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleManageSubscription = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await createPortalSession();
			if (response.url) {
				window.location.href = response.url;
			}
		} catch (err) {
			console.error(err);
			setError('Failed to redirect to subscription portal.');
		} finally {
			setLoading(false);
		}
	};

	if (!user.membershipTier) {
		return (
			<Paper
				elevation={0}
				sx={{
					p: 3,
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: 2,
				}}
			>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Box>
						<Typography variant="h6" gutterBottom>
							Membership
						</Typography>
						<Typography variant="body2" color="text.secondary">
							You are not currently subscribed to any plan.
						</Typography>
					</Box>
					<Button variant="outlined" color="primary" href="/membership">
						View Plans
					</Button>
				</Stack>
			</Paper>
		);
	}

	const isActive =
		user.membershipStatus === 'active' || user.membershipStatus === 'trialing';

	return (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: 2,
			}}
		>
			<Box sx={{ mb: 3 }}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					flexWrap="wrap"
					gap={2}
				>
					<Typography variant="h6">Membership Details</Typography>
					<Chip
						label={user.membershipStatus?.toUpperCase()}
						color={isActive ? 'success' : 'warning'}
						variant="filled"
					/>
				</Stack>
			</Box>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Box sx={{ mb: 2 }}>
						<Typography variant="subtitle2" color="text.secondary">
							Current Plan
						</Typography>
						<Typography variant="h5" color="primary" fontWeight="bold">
							{TIER_DISPLAY_NAMES[user.membershipTier] || user.membershipTier}
						</Typography>
					</Box>
					<Box>
						<Typography variant="subtitle2" color="text.secondary">
							Renewal Date
						</Typography>
						<Typography variant="body1">
							{user.currentPeriodEnd
								? dayjs(user.currentPeriodEnd).format('MMMM D, YYYY')
								: 'N/A'}
						</Typography>
					</Box>
				</Grid>
				<Grid
					size={{ xs: 12, md: 6 }}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: { xs: 'flex-start', md: 'flex-end' },
					}}
				>
					<Stack spacing={2} width={{ xs: '100%', md: 'auto' }}>
						{error && <Alert severity="error">{error}</Alert>}
						<Button
							variant="contained"
							color="inherit"
							onClick={handleManageSubscription}
							disabled={loading}
							startIcon={loading ? <CircularProgress size={20} /> : null}
						>
							Manage Subscription
						</Button>
					</Stack>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default SubscriptionManagement;
