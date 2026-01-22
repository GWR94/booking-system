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
	InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
	Email,
	Phone,
	LocationOn,
	Send,
	Person,
	Subject,
} from '@mui/icons-material';
import { sendContactMessage } from '@api';
import { useSnackbar } from '@context';

interface ContactFormProps {
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	elevation?: number;
}

const ContactForm: React.FC<ContactFormProps> = ({
	maxWidth = 'md',
	elevation = 0,
}) => {
	const theme = useTheme();

	const { showSnackbar } = useSnackbar();
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
			email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
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
			const response = await sendContactMessage(formData);

			if (!response.success) {
				throw new Error('Failed to send message');
			}

			showSnackbar(
				'Your message has been sent successfully. We will get back to you soon.',
				'success',
			);
			setSubmitted(true);
			setFormData({
				name: '',
				email: '',
				phone: '',
				subject: '',
				message: '',
			});
		} catch (error) {
			console.error('Error sending message:', error);
			showSnackbar(
				'There was an error sending your message. Please try again later.',
				'error',
			);
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
								textAlign="justify"
							>
								Have questions about our services? Need to book a slot or
								inquire about membership? Feel free to get in touch with us
								using the form or our contact details below.
							</Typography>

							<Box sx={{ mt: 3 }}>
								<Box sx={{ display: 'flex', mb: 3 }}>
									<LocationOn sx={{ mr: 2, fontSize: 22 }} color="accent" />
									<Box>
										<Typography variant="body2" fontWeight={500}>
											Our Location
										</Typography>
										<Typography
											variant="body2"
											sx={{ color: 'rgba(255,255,255,0.8)' }}
										>
											Royal Star Arcade, High St, Maidstone ME14 1JL
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: 'flex', mb: 3 }}>
									<Phone sx={{ mr: 2, fontSize: 22 }} color="accent" />
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
									<Email sx={{ mr: 2, fontSize: 22 }} color="accent" />
									<Box>
										<Typography variant="body2" fontWeight={500}>
											Email Address
										</Typography>
										<Typography
											variant="body2"
											sx={{ color: 'rgba(255,255,255,0.8)' }}
										>
											golf@jamesgower.dev
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
									Monday - Saturday <br />
									10:00 AM - 10:00 PM
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
												slotProps={{
													input: {
														startAdornment: (
															<InputAdornment position="start">
																<Person color="action" fontSize="small" />
															</InputAdornment>
														),
													},
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
												slotProps={{
													input: {
														startAdornment: (
															<InputAdornment position="start">
																<Email color="action" fontSize="small" />
															</InputAdornment>
														),
													},
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
												slotProps={{
													input: {
														startAdornment: (
															<InputAdornment position="start">
																<Phone color="action" fontSize="small" />
															</InputAdornment>
														),
													},
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
												slotProps={{
													input: {
														startAdornment: (
															<InputAdornment position="start">
																<Subject color="action" fontSize="small" />
															</InputAdornment>
														),
													},
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
											<LoadingButton
												type="submit"
												variant="contained"
												color="primary"
												size="large"
												loading={loading}
												disabled={loading}
												sx={{
													mt: 2,
													px: 4,
													py: 1.5,
													fontWeight: 500,
												}}
											>
												Send Message
											</LoadingButton>
										</Grid>
									</Grid>
								</form>
							)}
						</Box>
					</Grid>
				</Grid>
			</Paper>
		</Container>
	);
};

export default ContactForm;
