import {
	Box,
	Typography,
	TextField,
	Container,
	Button,
	useTheme,
	useMediaQuery,
	InputAdornment,
	Divider,
	Chip,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '@context';
import { guestSchema } from '../../../validation/schema';
import { validateGuestInput } from '@utils';
import { checkEmailExists } from '@api';
import ReCAPTCHA from 'react-google-recaptcha';
import { useBasket } from '@hooks';
import { LoadingButton } from '@mui/lab';
import {
	PersonOutline as PersonOutlineIcon,
	EmailOutlined as EmailOutlinedIcon,
	PhoneOutlined as PhoneOutlinedIcon,
	LockOutlined as LockOutlinedIcon,
	VerifiedUserOutlined as VerifiedUserOutlinedIcon,
	InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import { GuestUser } from './types';

const initialGuest: GuestUser = {
	name: '',
	email: '',
	phone: '',
};

interface GuestInfoProps {
	onSubmit: (guest: GuestUser, recaptchaToken: string) => void;
}

const GuestInfo = ({ onSubmit }: GuestInfoProps) => {
	const [guest, setGuest] = useState(initialGuest);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { basket } = useBasket();
	const navigate = useNavigate();
	const { showSnackbar } = useSnackbar();
	const [isLoading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const { isValid, errors: validationErrors } = validateGuestInput(
			guest,
			guestSchema,
		);

		if (!isValid) {
			setErrors(validationErrors);
			showSnackbar('Please correct the errors in the form.', 'error');
			setLoading(false);
			return;
		}

		const response = await checkEmailExists(guest.email);
		if (response.exists && response.role !== 'guest') {
			showSnackbar(
				'You have an account with this email. Please sign in.',
				'error',
			);
			setErrors({
				...errors,
				email: 'Email already registered',
			});
			setLoading(false);
			return;
		}
		if (!recaptchaToken) {
			showSnackbar('Please complete the reCAPTCHA.', 'error');
			setLoading(false);
			return;
		}
		if (basket.length === 0) {
			showSnackbar('Add an item to the basket to checkout');
			navigate('/');
			setLoading(false);
			return;
		}
		setErrors({});
		onSubmit(guest, recaptchaToken);
		setLoading(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setGuest((prevGuest) => ({ ...prevGuest, [name]: value }));
		if (errors[name]) {
			setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
		}
	};

	return (
		<Container maxWidth="md" sx={{ py: 4 }}>
			{/* Header Section */}
			<Box sx={{ mb: 6, textAlign: 'center' }}>
				<Typography
					variant="h3"
					component="h1"
					fontWeight="700"
					color="text.primary"
					gutterBottom
				>
					Guest Checkout
				</Typography>
				<Typography
					variant="h6"
					color="text.secondary"
					sx={{ mb: 3, maxWidth: 600, mx: 'auto', fontWeight: 400 }}
				>
					Complete your booking quickly and securely. We'll send your
					confirmation to the email address you provide.
				</Typography>

				{/* Trust Indicators */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						gap: 2,
						flexWrap: 'wrap',
					}}
				>
					<Chip
						icon={<LockOutlinedIcon />}
						label="Secure Checkout"
						variant="outlined"
						color="success"
						sx={{ px: 1 }}
					/>
					<Chip
						icon={<VerifiedUserOutlinedIcon />}
						label="Privacy Protected"
						variant="outlined"
						color="primary"
						sx={{ px: 1 }}
					/>
				</Box>
			</Box>

			<Box component="form" onSubmit={handleSubmit}>
				{/* Contact Information Section */}
				<Box sx={{ mb: 6 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
						<PersonOutlineIcon color="primary" sx={{ fontSize: 28, mr: 1.5 }} />
						<Typography variant="h5" fontWeight="600" color="text.primary">
							Contact Information
						</Typography>
					</Box>

					<Box
						sx={{
							display: 'grid',
							gap: 3,
							gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
						}}
					>
						<TextField
							label="Full Name"
							fullWidth
							name="name"
							value={guest.name}
							required
							onChange={handleChange}
							error={!!errors.name}
							helperText={errors.name || 'Enter your first and last name'}
							placeholder="John Smith"
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<PersonOutlineIcon
												color="inherit"
												sx={{
													color: theme.palette.error.light,
												}}
											/>
										</InputAdornment>
									),
								},
								formHelperText: {
									sx: {
										fontSize: '0.75rem',
										fontStyle: 'italic',
										color: theme.palette.grey[500],
									},
								},
							}}
							sx={{ gridColumn: '1 / -1' }}
						/>

						<TextField
							label="Email Address"
							fullWidth
							type="email"
							name="email"
							value={guest.email}
							onChange={handleChange}
							required
							error={!!errors.email}
							helperText={
								errors.email || "We'll send your booking confirmation here"
							}
							placeholder="john.smith@example.com"
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<EmailOutlinedIcon
												color="inherit"
												sx={{
													color: theme.palette.error.light,
												}}
											/>
										</InputAdornment>
									),
								},
								formHelperText: {
									sx: {
										fontSize: '0.75rem',
										fontStyle: 'italic',
										color: theme.palette.grey[500],
									},
								},
							}}
						/>

						<TextField
							label="Phone Number (Optional)"
							fullWidth
							type="tel"
							name="phone"
							value={guest?.phone || ''}
							onChange={handleChange}
							error={!!errors.phone}
							helperText={errors.phone || 'For booking updates and support'}
							placeholder="+44 7700 900000"
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<PhoneOutlinedIcon
												color="inherit"
												sx={{
													color: theme.palette.error.light,
												}}
											/>
										</InputAdornment>
									),
								},
								formHelperText: {
									sx: {
										fontSize: '0.75rem',
										fontStyle: 'italic',
										color: theme.palette.grey[500],
									},
								},
							}}
						/>
					</Box>
				</Box>

				<Divider sx={{ mb: 6 }} />

				{/* Security Verification */}
				<Box sx={{ mb: 6, textAlign: 'center' }}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							mb: 2,
						}}
					>
						<LockOutlinedIcon color="primary" sx={{ mr: 1 }} />
						<Typography variant="h6" fontWeight="600">
							Security Verification
						</Typography>
					</Box>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							p: 2,
						}}
					>
						<ReCAPTCHA
							sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
							onChange={(token) => setRecaptchaToken(token)}
						/>
					</Box>

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1,
							mt: 2,
						}}
					>
						<InfoOutlinedIcon
							sx={{
								fontSize: 18,
								color: theme.palette.text.secondary,
							}}
						/>
						<Typography variant="caption" color="text.secondary">
							Your data is processed securely.
						</Typography>
					</Box>
				</Box>

				{/* Action Buttons */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: isMobile ? 'column' : 'row',
						justifyContent: 'center',
						gap: 2,
					}}
				>
					<Button
						onClick={() => navigate('/')}
						variant="outlined"
						size="large"
						fullWidth={isMobile}
						sx={{
							px: 4,
							py: 1.5,
							borderRadius: 2,
						}}
					>
						Go Back
					</Button>
					<LoadingButton
						type="submit"
						variant="contained"
						color="primary"
						loading={isLoading}
						fullWidth={isMobile}
						disabled={!guest.email || !guest.name || !recaptchaToken}
						sx={{
							px: 6,
							py: 1.5,
							borderRadius: 2,
						}}
					>
						Continue to Payment
					</LoadingButton>
				</Box>
			</Box>
		</Container>
	);
};

export default GuestInfo;
