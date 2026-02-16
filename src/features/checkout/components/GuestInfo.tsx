'use client';

import {
	Box,
	Typography,
	TextField,
	Container,
	Button,
	useTheme,
	useMediaQuery,
	Card,
	CardContent,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@context';
import { guestSchema } from '@validation/form-schemas';
import { validateGuestInput } from '@utils';
import { checkEmailExists } from '@api';
import ReCAPTCHA from 'react-google-recaptcha';
import { useBasket } from '@hooks';
import { LoadingButton } from '@ui';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
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
	const router = useRouter();
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
			router.push('/');
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
			<Box
				component="form"
				onSubmit={handleSubmit}
				maxWidth="md"
				sx={{ mx: 'auto' }}
			>
				<Card
					variant="outlined"
					sx={{ mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}
				>
					<CardContent sx={{ p: 4 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ mb: 3, fontWeight: 700 }}
						>
							Contact Information
						</Typography>

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
								helperText={errors.name}
								placeholder="John Smith"
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
							/>

							<TextField
								label="Phone Number (Optional)"
								fullWidth
								type="tel"
								name="phone"
								value={guest?.phone || ''}
								onChange={handleChange}
								error={!!errors.phone}
								helperText={errors.phone}
								placeholder="+44 7700 900000"
							/>
						</Box>
					</CardContent>
				</Card>

				<Card
					variant="outlined"
					sx={{ mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}
				>
					<CardContent sx={{ p: 4, textAlign: 'center' }}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								mb: 3,
							}}
						>
							<LockOutlinedIcon color="primary" sx={{ mr: 1 }} />
							<Typography variant="h6" fontWeight="700">
								Security Verification
							</Typography>
						</Box>

						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								mb: 2,
							}}
						>
							<ReCAPTCHA
								sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || ''}
								onChange={(token) => setRecaptchaToken(token)}
							/>
						</Box>

						<Typography variant="caption" color="text.secondary">
							We use reCAPTCHA to protect your data.
						</Typography>
					</CardContent>
				</Card>

				<Box
					sx={{
						display: 'flex',
						flexDirection: isMobile ? 'column' : 'row',
						justifyContent: 'center',
						gap: 2,
					}}
				>
					<Button
						onClick={() => router.push('/')}
						variant="outlined"
						size="large"
						fullWidth={isMobile}
						sx={{
							px: 4,
							py: 1.5,
							borderRadius: 2,
							height: 56,
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
							height: 56,
							fontWeight: 700,
							boxShadow: '0 4px 14px 0 rgba(0,0,0,0.25)',
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
