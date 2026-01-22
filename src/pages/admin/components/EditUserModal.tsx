import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Box,
	MenuItem,
	Typography,
	Alert,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserDetails, resetUserPassword } from '@api';
import { useSnackbar } from '@context';

interface EditUserModalProps {
	user: any;
	open: boolean;
	onClose: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
	user,
	open,
	onClose,
}) => {
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		role: '',
		membershipTier: '',
		membershipStatus: '',
	});

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				role: user.role || 'user',
				membershipTier: user.membershipTier || '',
				membershipStatus: user.membershipStatus || 'INACTIVE',
			});
		}
	}, [user]);

	const updateMutation = useMutation({
		mutationFn: (data: any) => updateUserDetails(user.id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
			showSnackbar('User updated successfully', 'success');
			onClose();
		},
		onError: (error: any) => {
			showSnackbar(
				error.response?.data?.message || 'Failed to update user',
				'error',
			);
		},
	});

	const resetPasswordMutation = useMutation({
		mutationFn: () => resetUserPassword(user.id),
		onSuccess: () => {
			showSnackbar('Password reset email sent to user', 'success');
		},
		onError: (error: any) => {
			showSnackbar(
				error.response?.data?.message || 'Failed to send reset email',
				'error',
			);
		},
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleUpdate = () => {
		updateMutation.mutate(formData);
	};

	const handleResetPassword = () => {
		resetPasswordMutation.mutate();
	};

	if (!user) return null;

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Edit User: {user.name}</DialogTitle>
			<DialogContent dividers>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
					<Typography variant="subtitle1" fontWeight={600}>
						User Details
					</Typography>
					<TextField
						label="Name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						fullWidth
						size="small"
					/>
					<TextField
						label="Email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						fullWidth
						size="small"
					/>
					<TextField
						select
						label="Role"
						name="role"
						value={formData.role}
						onChange={handleChange}
						fullWidth
						size="small"
					>
						<MenuItem value="user">User</MenuItem>
						<MenuItem value="admin">Admin</MenuItem>
					</TextField>
					<TextField
						select
						label="Membership Tier"
						name="membershipTier"
						value={formData.membershipTier}
						onChange={handleChange}
						fullWidth
						size="small"
					>
						<MenuItem value="">None</MenuItem>
						<MenuItem value="PAR">PAR</MenuItem>
						<MenuItem value="BIRDIE">BIRDIE</MenuItem>
						<MenuItem value="HOLEINONE">HOLE IN ONE</MenuItem>
					</TextField>
					<TextField
						select
						label="Membership Status"
						name="membershipStatus"
						value={formData.membershipStatus}
						onChange={handleChange}
						fullWidth
						size="small"
					>
						<MenuItem value="ACTIVE">Active</MenuItem>
						<MenuItem value="INACTIVE">Inactive</MenuItem>
						<MenuItem value="CANCELLED">Cancelled</MenuItem>
						<MenuItem value="PAUSED">Paused</MenuItem>
					</TextField>
				</Box>

				<Accordion elevation={0} sx={{ border: '1px solid #eee' }}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography fontWeight={600}>Reset Password</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<Alert severity="info" sx={{ mb: 1 }}>
								This will send an email to the user with a link to reset their
								password.
							</Alert>
							<Button
								variant="contained"
								color="warning"
								onClick={handleResetPassword}
								disabled={resetPasswordMutation.isPending}
							>
								{resetPasswordMutation.isPending ? (
									<CircularProgress size={24} color="inherit" />
								) : (
									'Send Password Reset Email'
								)}
							</Button>
						</Box>
					</AccordionDetails>
				</Accordion>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					onClick={handleUpdate}
					variant="contained"
					disabled={updateMutation.isPending}
				>
					{updateMutation.isPending ? (
						<CircularProgress size={24} color="inherit" />
					) : (
						'Save Changes'
					)}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditUserModal;
