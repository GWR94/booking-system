'use client';

import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import {
	createGuestPaymentIntent,
	createPaymentIntent,
	getBasket,
} from '@api';
import { Appearance, loadStripe } from '@stripe/stripe-js';
import { CheckoutForm, GuestUser, GuestInfo, CheckoutSkeleton } from './components';
import { useBasket, useAuth } from '@hooks';
import { useSnackbar } from '@context';
import { trackBeginCheckout } from '@utils/analytics';
import { SectionHeader, AnimateIn } from '@ui';
import { useRouter, useSearchParams } from 'next/navigation';
import type { CheckoutIdentityMode } from './checkout-contract';

const stripe = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const Checkout = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const paymentIntentClientSecret = searchParams?.get(
		'payment_intent_client_secret',
	);

	const [clientSecret, setClientSecret] = useState(paymentIntentClientSecret || '');
	/**
	 * Start non-loading so guest checkout doesn't get stuck on the skeleton
	 * while we wait for client-side session/basket hydration
	 */
	const [isLoading, setLoading] = useState(false);
	const [clientSecretError, setClientSecretError] = useState(false);
	const [guestInfo, setGuestInfo] = useState<GuestUser | null>(null);
	const [recaptchaToken, setRecaptchaToken] = useState<string>('');

	const { showSnackbar } = useSnackbar();
	const { basket, basketPrice, isBasketFetched } = useBasket();
	const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
	const identityMode: CheckoutIdentityMode = isAuthenticated
		? 'authenticated'
		: 'guest';
	const beginCheckoutTracked = useRef(false);
	const theme = useTheme();
	const [isFreeBooking, setIsFreeBooking] = useState(false);
	const hasBasketItems = basket.length > 0;
	const isReturningFromStripe = Boolean(paymentIntentClientSecret);
	const isAuthUnresolved = isAuthLoading && !isAuthenticated;
	const shouldRedirectEmptyBasket =
		isBasketFetched && !hasBasketItems && !isReturningFromStripe;

	useEffect(() => {
		if (!shouldRedirectEmptyBasket) return;
		router.replace('/book');
	}, [router, shouldRedirectEmptyBasket]);

	useEffect(() => {
		// Fallback guard: if basket query hydration is delayed, check persisted basket directly.
		if (
			isReturningFromStripe ||
			shouldRedirectEmptyBasket ||
			hasBasketItems ||
			isBasketFetched !== false
		)
			return;
		const persistedBasket = getBasket();
		if (persistedBasket.length === 0) {
			router.replace('/book');
		}
	}, [
		hasBasketItems,
		isBasketFetched,
		isReturningFromStripe,
		router,
		shouldRedirectEmptyBasket,
	]);

	useEffect(() => {
		if (isReturningFromStripe) return;

		const getClientSecret = async () => {
			if (!hasBasketItems) {
				setLoading(false);
				setClientSecretError(false);
				return;
			}

			if (isAuthUnresolved) {
				setLoading(false);
				return;
			}

			const runAuthenticatedCheckoutStrategy = async () => {
				// Guest checkout creates its intent via `handleSubmitGuest`.
				// Only auto-create intent here for authenticated users.
				if (identityMode !== 'authenticated') {
					setLoading(false);
					setClientSecretError(false);
					return;
				}

				// Any time we attempt to fetch a client secret, clear error state.
				setClientSecretError(false);
				setLoading(true);
				try {
					const { clientSecret, amount } = await createPaymentIntent(basket);

					if (clientSecret === null && amount === 0) {
						setIsFreeBooking(true);
						setClientSecret('');
					} else {
						setIsFreeBooking(false);
						setClientSecret(clientSecret);
					}
				} catch (error: any) {
					if (error?.response?.status === 401) {
						// Don't force logout here; this can be a transient auth mismatch.
						setClientSecretError(true);
						setClientSecret('');
						return;
					}

					setClientSecretError(true);
					console.error('Error fetching client secret:', error);
				} finally {
					setLoading(false);
				}
			};

			await runAuthenticatedCheckoutStrategy();
		};
		getClientSecret();
	}, [basket, hasBasketItems, identityMode, isAuthUnresolved, isReturningFromStripe]);

	const runGuestCheckoutStrategy = () => {
		if (identityMode !== 'guest' || guestInfo || paymentIntentClientSecret) {
			return null;
		}
		return <GuestInfo onSubmit={handleSubmitGuest} />;
	};

	const runAuthenticatedCheckoutStrategy = () => {
		if (clientSecretError && identityMode === 'authenticated' && !paymentIntentClientSecret) {
			return (
				<Box
					sx={{
						py: 6,
						px: 3,
						bgcolor: 'background.paper',
						borderRadius: 2,
						border: '1px solid',
						borderColor: 'divider',
					}}
				>
					<Stack spacing={2} alignItems="center">
						<Typography variant="h6" textAlign="center">
							Unable to start checkout
						</Typography>
						<Button variant="contained" onClick={() => router.refresh()}>
							Try again
						</Button>
					</Stack>
				</Box>
			);
		}

		if (isFreeBooking) {
			return (
				<CheckoutForm
					guest={guestInfo}
					recaptchaToken={recaptchaToken}
					isFree={true}
				/>
			);
		}

		if (!clientSecret) {
			return <CheckoutSkeleton />;
		}

		return (
			<Elements options={{ clientSecret, appearance, loader }} stripe={stripe}>
				<CheckoutForm guest={guestInfo} recaptchaToken={recaptchaToken} />
			</Elements>
		);
	};

	useEffect(() => {
		if (
			basket.length > 0 &&
			!isLoading &&
			!paymentIntentClientSecret &&
			!beginCheckoutTracked.current
		) {
			beginCheckoutTracked.current = true;
			const value = parseFloat(String(basketPrice)) || 0;
			trackBeginCheckout({
				value: Math.round(value * 100) / 100,
				currency: 'GBP',
				items: [{ quantity: basket.length }],
			});
		}
	}, [basket.length, basketPrice, isLoading, paymentIntentClientSecret]);

	const appearance: Appearance = {
		theme: 'stripe',
		variables: {
			colorPrimary: theme.palette.primary.main,
			colorText: theme.palette.text.primary,
		},
	};

	const handleSubmitGuest = async (
		guest: GuestUser,
		recaptchaToken: string,
	) => {
		try {
			const response = await createGuestPaymentIntent(
				basket,
				guest,
				recaptchaToken,
			);
			if (response.clientSecret === null && response.amount === 0) {
				setIsFreeBooking(true);
				setClientSecret('');
			} else {
				setClientSecret(response.clientSecret);
			}
			setGuestInfo(guest);
			setRecaptchaToken(recaptchaToken);
		} catch (error: any) {
			if (error.response?.data?.error === 'RECAPTCHA_FAILED') {
				setGuestInfo(null);
				showSnackbar('reCAPTCHA verification failed. Please try again.');
			}
			console.error(error);
		}
	};

	const loader = 'auto';

	const renderContent = () => {
		// Redirect is handled in an effect; return null to avoid UI flash during redirect.
		if (shouldRedirectEmptyBasket) {
			return null;
		}

		if (isLoading) {
			return <CheckoutSkeleton />;
		}

		if (isAuthUnresolved && !guestInfo && !isReturningFromStripe) {
			return <CheckoutSkeleton />;
		}

		const guestFlow = runGuestCheckoutStrategy();
		if (guestFlow) return guestFlow;
		return runAuthenticatedCheckoutStrategy();
	};

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: 'grey.50',
				pt: { xs: 4, md: 8 },
				pb: { xs: 8, md: 12 },
			}}
		>
			<Container maxWidth="lg">
				<SectionHeader
					title="Review & Pay"
					subtitle="CHECKOUT"
					description="Review your booking details and securely complete your payment."
				/>
				<AnimateIn>
					<Box maxWidth="lg" sx={{ mx: 'auto' }}>
						{renderContent()}
					</Box>
				</AnimateIn>
			</Container>
		</Box>
	);
};

export default Checkout;
