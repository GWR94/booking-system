import React, { useState } from 'react';
import {
	Box,
	Container,
	Typography,
	TextField,
	Button,
	Grid2 as Grid,
	Paper,
	useTheme,
	MenuItem,
	Alert,
	Snackbar,
	InputAdornment,
	CircularProgress,
} from '@mui/material';
import {
	Email,
	Phone,
	LocationOn,
	Send,
	Person,
	Subject,
} from '@mui/icons-material';

interface ContactFormProps {
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	elevation?: number;
}

const ContactForm: React.FC<ContactFormProps> = ({
	maxWidth = 'md',
	elevation = 0,
}) => {
	const theme = useTheme();

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: '',
	});

	const [errors, setErrors] = useState({
		name: false,
		email: false,
		subject: false,
		message: false,
	});

	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
		'success',
	);

	const subjectOptions = [
		'General Inquiry',
		'Booking Question',
		'Technical Support',
		'Feedback',
		'Membership',
		'Corporate Events',
		'Other',
	];

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// Clear error when user types
		if (errors[name as keyof typeof errors]) {
			setErrors({
				...errors,
				[name]: false,
			});
		}
	};

	const validateForm = () => {
		const newErrors = {
			name: formData.name.trim() === '',
			email: !/^\S+@\S+\.\S+$/.test(formData.email),
			subject: formData.subject.trim() === '',
			message: formData.message.trim() === '',
		};

		setErrors(newErrors);
		return !Object.values(newErrors).some((error) => error);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setSnackbarMessage(
				'Your message has been sent successfully. We will get back to you soon.',
			);
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
			setSubmitted(true);

			// Reset form
			setFormData({
				name: '',
				email: '',
				phone: '',
				subject: '',
				message: '',
			});
		} catch (error) {
			console.error('Error sending message:', error);
			setSnackbarMessage(
				'There was an error sending your message. Please try again later.',
			);
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth={maxWidth} sx={{ py: 4 }}>
			<Paper
				elevation={elevation}
				sx={{
					borderRadius: 2,
					overflow: 'hidden',
					border: `1px solid ${theme.palette.divider}`,
				}}
			>
				<Grid container>
					{/* Contact Information Section */}
					<Grid size={{ xs: 12, md: 4 }}>
						<Box
							sx={{
								p: 4,
								height: '100%',
								bgcolor: theme.palette.primary.main,
								color: 'white',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Typography
								variant="h5"
								component="h2"
								fontWeight={600}
								sx={{ mb: 4 }}
							>
								Contact Information
							</Typography>

							<Typography
								variant="body2"
								sx={{ color: 'rgba(255,255,255,0.8)' }}
							>
								Have questions about our services? Need to book a slot or
								inquire about membership? Feel free to get in touch with us
								using the form or our contact details below.
							</Typography>

							<Box sx={{ mt: 3 }}>
								<Box sx={{ display: 'flex', mb: 3 }}>
									<LocationOn sx={{ mr: 2, fontSize: 22 }} />
									<Box>
										<Typography variant="body2" fontWeight={500}>
											Our Location
										</Typography>
										<Typography
											variant="body2"
											sx={{ color: 'rgba(255,255,255,0.8)' }}
										>
											123 Golf Lane, London, SW1 2AB
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: 'flex', mb: 3 }}>
									<Phone sx={{ mr: 2, fontSize: 22 }} />
									<Box>
										<Typography variant="body2" fontWeight={500}>
											Phone Number
										</Typography>
										<Typography
											variant="body2"
											sx={{ color: 'rgba(255,255,255,0.8)' }}
										>
											+44 79874 45123
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: 'flex' }}>
									<Email sx={{ mr: 2, fontSize: 22 }} />
									<Box>
										<Typography variant="body2" fontWeight={500}>
											Email Address
										</Typography>
										<Typography
											variant="body2"
											sx={{ color: 'rgba(255,255,255,0.8)' }}
										>
											info@gwrgolf.com
										</Typography>
									</Box>
								</Box>
							</Box>

							<Box
								sx={{
									mt: 4,
									pt: 4,
									borderTop: '1px solid rgba(255,255,255,0.2)',
								}}
							>
								<Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
									Operating Hours
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: 'rgba(255,255,255,0.8)' }}
								>
									Monday - Friday: 8:00 AM - 10:00 PM
								</Typography>
								<Typography
									variant="body2"
									sx={{
										color: 'rgba(255,255,255,0.8)',
										mb: 2,
									}}
								>
									Saturday - Sunday: 9:00 AM - 8:00 PM
								</Typography>
							</Box>
						</Box>
					</Grid>

					{/* Form Section */}
					<Grid size={{ xs: 12, md: 8 }}>
						<Box sx={{ p: 4 }}>
							<Typography
								variant="h5"
								component="h2"
								fontWeight={600}
								sx={{ mb: 1 }}
							>
								Send Us a Message
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
								Fill out the form below and we'll get back to you as soon as
								possible.
							</Typography>

							{submitted ? (
								<Box sx={{ textAlign: 'center', py: 4 }}>
									<Send
										sx={{
											fontSize: 60,
											color: theme.palette.success.main,
											mb: 2,
										}}
									/>
									<Typography variant="h6" gutterBottom>
										Thank You!
									</Typography>
									<Typography variant="body1" color="text.secondary" paragraph>
										Your message has been sent successfully.
									</Typography>
									<Typography variant="body2" color="text.secondary" paragraph>
										We typically respond within 1-2 business days.
									</Typography>
									<Button
										variant="outlined"
										color="primary"
										onClick={() => setSubmitted(false)}
										sx={{ mt: 2 }}
									>
										Send Another Message
									</Button>
								</Box>
							) : (
								<form onSubmit={handleSubmit}>
									<Grid container spacing={3}>
										<Grid size={{ xs: 12, sm: 6 }}>
											<TextField
												fullWidth
												label="Full Name"
												name="name"
												value={formData.name}
												onChange={handleChange}
												error={errors.name}
												helperText={errors.name ? 'Name is required' : ''}
												required
												variant="outlined"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<Person color="action" fontSize="small" />
														</InputAdornment>
													),
												}}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6 }}>
											<TextField
												fullWidth
												label="Email Address"
												name="email"
												type="email"
												value={formData.email}
												onChange={handleChange}
												error={errors.email}
												helperText={
													errors.email ? 'Valid email is required' : ''
												}
												required
												variant="outlined"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<Email color="action" fontSize="small" />
														</InputAdornment>
													),
												}}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6 }}>
											<TextField
												fullWidth
												label="Phone Number (Optional)"
												name="phone"
												value={formData.phone}
												onChange={handleChange}
												variant="outlined"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<Phone color="action" fontSize="small" />
														</InputAdornment>
													),
												}}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6 }}>
											<TextField
												select
												fullWidth
												label="Subject"
												name="subject"
												value={formData.subject}
												onChange={handleChange}
												error={errors.subject}
												helperText={
													errors.subject ? 'Please select a subject' : ''
												}
												required
												variant="outlined"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<Subject color="action" fontSize="small" />
														</InputAdornment>
													),
												}}
											>
												{subjectOptions.map((option) => (
													<MenuItem key={option} value={option}>
														{option}
													</MenuItem>
												))}
											</TextField>
										</Grid>
										<Grid size={{ xs: 12 }}>
											<TextField
												fullWidth
												label="Message"
												name="message"
												value={formData.message}
												onChange={handleChange}
												error={errors.message}
												helperText={
													errors.message ? 'Please enter your message' : ''
												}
												required
												multiline
												rows={6}
												variant="outlined"
											/>
										</Grid>
										<Grid size={{ xs: 12 }}>
											<Button
												type="submit"
												variant="contained"
												color="primary"
												size="large"
												disabled={loading}
												sx={{
													mt: 2,
													px: 4,
													py: 1.5,
													fontWeight: 500,
													position: 'relative',
												}}
											>
												{loading && (
													<CircularProgress
														size={24}
														sx={{
															position: 'absolute',
															left: '50%',
															marginLeft: '-12px',
														}}
													/>
												)}
												{loading ? 'Sending...' : 'Send Message'}
											</Button>
										</Grid>
									</Grid>
								</form>
							)}
						</Box>
					</Grid>
				</Grid>
			</Paper>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={() => setSnackbarOpen(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={() => setSnackbarOpen(false)}
					severity={snackbarSeverity}
					variant="filled"
					sx={{ width: '100%' }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default ContactForm;
