import {
	Box,
	Typography,
	TextField,
	Container,
	Button,
	useTheme,
	useMediaQuery,
	InputAdornment,
	Paper,
	Divider,
	Chip,
	alpha,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '@context';
import { guestSchema } from '../../validation/schema';
import validateGuestInput from '../../utils/validGuestInput';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { useBasket } from '@hooks/useBasket';
import { LoadingButton } from '@mui/lab';
import {
	PersonOutline as PersonOutlineIcon,
	EmailOutlined as EmailOutlinedIcon,
	PhoneOutlined as PhoneOutlinedIcon,
	LockOutlined as LockOutlinedIcon,
	VerifiedUserOutlined as VerifiedUserOutlinedIcon,
	InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';

export interface GuestUser {
	name: string;
	email: string;
	phone?: string;
}

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

	const handleSubmit = async () => {
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

		const response = await axios.get(
			`/api/user/check-email?email=${guest.email}`,
		);
		if (response.data.exists && response.data.role !== 'guest') {
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
		<Box>
			<Paper
				elevation={0}
				sx={{
					p: { xs: 2, sm: 3, md: 4 },
					borderRadius: 2,
					border: `1px solid ${theme.palette.divider}`,
					backgroundColor: theme.palette.background.paper,
				}}
			>
				{/* Header Section */}
				<Box sx={{ mb: 3 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
						<PersonOutlineIcon color="primary" />
						<Typography variant="h5" fontWeight="600" color="text.primary">
							Guest Checkout
						</Typography>
					</Box>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						Complete your booking quickly and securely. We'll send your
						confirmation to the email address you provide.
					</Typography>

					{/* Trust Indicators */}
					<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
						<Chip
							icon={<LockOutlinedIcon />}
							label="Secure Checkout"
							size="small"
							variant="outlined"
							color="success"
						/>
						<Chip
							icon={<VerifiedUserOutlinedIcon />}
							label="Privacy Protected"
							size="small"
							variant="outlined"
							color="primary"
						/>
					</Box>
				</Box>

				<Divider sx={{ mb: 3 }} />

				{/* Contact Information Section */}
				<Box sx={{ mb: 3 }}>
					<Typography
						variant="subtitle1"
						fontWeight="600"
						color="text.primary"
						sx={{ mb: 2 }}
					>
						Contact Information
					</Typography>

					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									'&:hover fieldset': {
										borderColor: theme.palette.primary.main,
									},
								},
							}}
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
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									'&:hover fieldset': {
										borderColor: theme.palette.primary.main,
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
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									'&:hover fieldset': {
										borderColor: theme.palette.primary.main,
									},
								},
							}}
						/>
					</Box>
				</Box>

				<Divider sx={{ mb: 3 }} />

				{/* Security Verification */}
				<Box sx={{ mb: 3 }}>
					<Typography
						variant="subtitle1"
						fontWeight="600"
						color="text.primary"
						sx={{ mb: 2 }}
					>
						Security Verification
					</Typography>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							p: 2,
							backgroundColor:
								theme.palette.mode === 'dark'
									? alpha(theme.palette.secondary.main, 0.05)
									: alpha(theme.palette.secondary.main, 0.03),
							borderRadius: 1,
							border: `1px solid ${
								theme.palette.mode === 'dark'
									? alpha(theme.palette.secondary.main, 0.15)
									: alpha(theme.palette.secondary.main, 0.1)
							}`,
						}}
					>
						<ReCAPTCHA
							sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
							onChange={(token) => setRecaptchaToken(token)}
						/>
					</Box>
				</Box>

				{/* Privacy Notice */}
				<Box
					sx={{
						display: 'flex',
						gap: 1,
						p: 2,
						mb: 3,
						backgroundColor:
							theme.palette.mode === 'dark'
								? alpha(theme.palette.accent.main, 0.08)
								: alpha(theme.palette.accent.main, 0.04),
						borderRadius: 1,
						border: `1px solid ${
							theme.palette.mode === 'dark'
								? alpha(theme.palette.accent.main, 0.2)
								: alpha(theme.palette.accent.main, 0.1)
						}`,
					}}
				>
					<InfoOutlinedIcon
						sx={{
							fontSize: 20,
							mt: 0.2,
							flexShrink: 0,
							color: theme.palette.accent.main,
						}}
					/>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ lineHeight: 1.5 }}
					>
						Your information is secure and will only be used to process your
						booking and send you confirmation details. We respect your privacy
						and will never share your data with third parties.
					</Typography>
				</Box>

				{/* Action Buttons */}
				<Container
					maxWidth="sm"
					sx={{
						display: 'flex',
						flexDirection: isMobile ? 'column' : 'row',
						justifyContent: 'space-evenly',
						alignItems: 'center',
						gap: 2,
						px: 0,
					}}
				>
					<Button
						onClick={() => navigate('/')}
						variant="outlined"
						color="inherit"
						sx={{
							minWidth: 200,
							height: 48,
							textTransform: 'none',
							fontSize: '1rem',
							fontWeight: 500,
						}}
						fullWidth={isMobile}
					>
						Go Back
					</Button>
					<LoadingButton
						onClick={handleSubmit}
						variant="contained"
						color="primary"
						loading={isLoading}
						sx={{
							minWidth: 200,
							height: 48,
							textTransform: 'none',
							fontSize: '1rem',
							fontWeight: 600,
							boxShadow: theme.shadows[2],
							'&:hover': {
								boxShadow: theme.shadows[4],
							},
						}}
						fullWidth={isMobile}
						disabled={!guest.email || !guest.name || !recaptchaToken}
					>
						Continue to Payment
					</LoadingButton>
				</Container>
			</Paper>
		</Box>
	);
};

export default GuestInfo;
