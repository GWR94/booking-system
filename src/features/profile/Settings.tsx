'use client';

import { SubscriptionManagement, DeleteAccountDialog } from './components';
import { PendingPaymentBanner } from './components';
import { Box, Button, Paper, Divider, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '@hooks';
import { SectionHeader } from '@ui';
import { getLatestResumablePendingBooking } from '@utils/pending-payment';

const Settings = () => {
	const { user } = useAuth();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const pendingBooking = getLatestResumablePendingBooking(user?.bookings);

	if (!user) return null;

	return (
		<Box maxWidth="sm" margin="auto">
			<SectionHeader
				subtitle="ACCOUNT"
				title="Settings"
				description="Manage your subscription and account preferences"
				noAnimation
			/>
			{pendingBooking && <PendingPaymentBanner bookingId={pendingBooking.id} />}

			<SubscriptionManagement user={user} />

			<Divider sx={{ my: 4 }} />

			<Paper variant="outlined" sx={{ p: 3, borderColor: 'error.main' }}>
				<Typography variant="h6" color="error" gutterBottom>
					Danger Zone
				</Typography>
				<Typography variant="body2" color="text.secondary" paragraph>
					Once you delete your account, there is no going back. Please be
					certain.
				</Typography>
				<Button
					variant="outlined"
					color="error"
					onClick={() => setDeleteOpen(true)}
				>
					Delete Account
				</Button>
			</Paper>

			<DeleteAccountDialog
				dialogOpen={deleteOpen}
				onClose={() => setDeleteOpen(false)}
				fullscreen={false}
			/>
		</Box>
	);
};

export default Settings;
