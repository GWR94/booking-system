'use client';

import React, { useState } from 'react';
import {
	Box,
	Typography,
	TextField,
	Button,
	Grid2 as Grid,
	useTheme,
	MenuItem,
	InputAdornment,
} from '@mui/material';
import { Email, Phone, Send, Person, Subject } from '@mui/icons-material';
import { sendContactMessage } from '@api';
import { useSnackbar } from '@context';

const ContactForm: React.FC = () => {
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
		<Box sx={{ p: { xs: 3, md: 4 } }}>
			<Typography
				variant="subtitle1"
				component="h2"
				fontWeight={600}
				sx={{ mb: 1 }}
			>
				Send us a message
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				Fill out the form below and we&apos;ll get back to you as soon as
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
					<Typography variant="h6" gutterBottom component="h3">
						Thank You!
					</Typography>
					<Typography variant="body1" color="text.secondary" component="p">
						Your message has been sent successfully.
					</Typography>
					<Typography variant="body2" color="text.secondary" component="p">
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
								helperText={errors.email ? 'Valid email is required' : ''}
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
								helperText={errors.subject ? 'Please select a subject' : ''}
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
								helperText={errors.message ? 'Please enter your message' : ''}
								required
								multiline
								rows={4}
								variant="outlined"
							/>
						</Grid>
						<Grid size={{ xs: 12 }}>
							<Button
								type="submit"
								variant="contained"
								color="secondary"
								size="large"
								disabled={loading}
								sx={{
									mt: 1,
									px: 4,
									py: 1.5,
									fontWeight: 500,
								}}
							>
								{loading ? 'Sending...' : 'Send Message'}
							</Button>
						</Grid>
					</Grid>
				</form>
			)}
		</Box>
	);
};

export default ContactForm;
