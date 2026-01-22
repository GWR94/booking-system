import { SubscriptionManagement, DeleteAccountDialog } from './components';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '@hooks';

const Settings = () => {
	const { user } = useAuth();
	const [deleteOpen, setDeleteOpen] = useState(false);

	if (!user) return null;

	return (
		<Box maxWidth="sm" margin="auto">
			<Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
				Account Settings
			</Typography>

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
