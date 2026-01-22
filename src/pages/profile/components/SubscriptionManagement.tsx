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
	alpha,
	useTheme,
} from '@mui/material';
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
					border: '1px solid',
					borderColor: 'divider',
					borderRadius: 2,
					bgcolor: alpha(theme.palette.primary.main, 0.02),
				}}
			>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					spacing={2}
				>
					<Box>
						<Typography variant="subtitle1" fontWeight="bold">
							Membership
						</Typography>
						<Typography variant="body2" color="text.secondary">
							You are not currently subscribed to any plan.
						</Typography>
					</Box>
					<Button
						variant="outlined"
						color="primary"
						href="/membership"
						sx={{ borderRadius: 2 }}
					>
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
				border: '1px solid',
				borderColor: 'divider',
				borderRadius: 2,
				bgcolor: alpha(theme.palette.primary.main, 0.02),
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
					<Typography variant="subtitle1" fontWeight="bold">
						Membership Details
					</Typography>
					<Chip
						label={user.membershipStatus?.toUpperCase()}
						color={isActive ? 'success' : 'warning'}
						variant="filled"
						size="small"
						sx={{ fontWeight: 'bold' }}
					/>
				</Stack>
			</Box>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Box sx={{ mb: 2 }}>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{
								textTransform: 'uppercase',
								fontWeight: 600,
								letterSpacing: 0.5,
							}}
						>
							Current Plan
						</Typography>
						<Typography variant="h5" color="primary" fontWeight="bold">
							{TIER_DISPLAY_NAMES[user.membershipTier] || user.membershipTier}
						</Typography>
					</Box>
					<Box>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{
								textTransform: 'uppercase',
								fontWeight: 600,
								letterSpacing: 0.5,
							}}
						>
							Renewal Date
						</Typography>
						<Typography variant="body1" fontWeight={500}>
							{user.currentPeriodEnd
								? dayjs(user.currentPeriodEnd).format('MMMM D, YYYY')
								: 'N/A'}
						</Typography>
					</Box>
				</Grid>

				{user.membershipUsage && (
					<Grid size={{ xs: 12 }}>
						<Box sx={{ mt: 2 }}>
							<Stack
								direction="row"
								justifyContent="space-between"
								alignItems="center"
								sx={{ mb: 1 }}
							>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{
										textTransform: 'uppercase',
										fontWeight: 600,
										letterSpacing: 0.5,
									}}
								>
									Monthly Included Hours
								</Typography>
								<Typography variant="caption" fontWeight="bold" color="primary">
									{user.membershipUsage.usedHours} /{' '}
									{user.membershipUsage.totalHours} Hours Used
								</Typography>
							</Stack>
							<Box
								sx={{
									width: '100%',
									height: 10,
									bgcolor: alpha(theme.palette.primary.main, 0.1),
									borderRadius: 5,
									overflow: 'hidden',
									position: 'relative',
								}}
							>
								<Box
									sx={{
										position: 'absolute',
										top: 0,
										left: 0,
										height: '100%',
										width: `${Math.min(
											100,
											(user.membershipUsage.usedHours /
												user.membershipUsage.totalHours) *
												100,
										)}%`,
										bgcolor: 'primary.main',
										transition: 'width 0.5s ease-out',
									}}
								/>
							</Box>
							<Typography
								variant="caption"
								color="text.secondary"
								sx={{ mt: 1, display: 'block' }}
							>
								{user.membershipUsage.remainingHours === 0
									? 'All included hours used for this period.'
									: `You have ${user.membershipUsage.remainingHours} hour(s) remaining for this period.`}
							</Typography>
						</Box>
					</Grid>
				)}

				<Grid
					size={{ xs: 12, md: 6 }}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: { xs: 'flex-start', md: 'flex-start' },
					}}
				>
					<Stack spacing={2} width={{ xs: '100%', md: 'auto' }} sx={{ mt: 2 }}>
						{error && <Alert severity="error">{error}</Alert>}
						<Button
							variant="contained"
							color="primary"
							onClick={handleManageSubscription}
							disabled={loading}
							startIcon={
								loading ? <CircularProgress size={20} color="inherit" /> : null
							}
							sx={{ borderRadius: 2, textTransform: 'none' }}
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
