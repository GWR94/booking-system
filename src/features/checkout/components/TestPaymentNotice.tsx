'use client';

import { useState } from 'react';
import {
	Paper,
	Box,
	Typography,
	Button,
	IconButton,
	Collapse,
	useTheme,
	alpha,
} from '@mui/material';
import {
	ContentCopy as ContentCopyIcon,
	CreditCard as CreditCardIcon,
	Close as CloseIcon,
} from '@mui/icons-material';
import { useSnackbar } from '@context';

const TestPaymentNotice = ({ membership }: { membership?: boolean }) => {
	const [isVisible, setIsVisible] = useState(true);
	const { showSnackbar } = useSnackbar();
	const theme = useTheme();

	// Only show in test mode (checking if key starts with pk_test)
	const isTestMode =
		process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test');

	if (!isTestMode || !isVisible) return null;

	const testCardNumber = '4242 4242 4242 4242';

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(testCardNumber);
			showSnackbar('Test card number copied to clipboard', 'success');
		} catch (err) {
			console.error('Failed to copy:', err);
			showSnackbar('Failed to copy to clipboard', 'error');
		}
	};

	return (
		<Collapse in={isVisible}>
			<Paper
				elevation={0}
				sx={{
					mb: 3,
					p: 2,
					border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
					bgcolor: alpha(theme.palette.info.main, 0.05),
					borderRadius: 2,
					position: 'relative',
				}}
			>
				<IconButton
					size="small"
					aria-label="close"
					onClick={() => setIsVisible(false)}
					sx={{
						position: 'absolute',
						top: 8,
						right: 8,
						color: 'text.secondary',
					}}
				>
					<CloseIcon fontSize="small" />
				</IconButton>

				<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
					<CreditCardIcon color="info" sx={{ mt: 0.5 }} />
					<Box sx={{ flex: 1 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
							<Typography
								variant="subtitle2"
								fontWeight="bold"
								color="info.main"
							>
								Test Mode Active
							</Typography>
							<Box
								sx={{
									bgcolor: 'info.main',
									color: 'white',
									px: 0.8,
									py: 0.2,
									borderRadius: 1,
									fontSize: '0.65rem',
									fontWeight: 'bold',
									textTransform: 'uppercase',
									letterSpacing: 0.5,
								}}
							>
								Demo
							</Box>
						</Box>

						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ mb: 1.5, maxWidth: '90%' }}
						>
							This is a test environment. If you use the test card number, no
							real payments will be processed, but your
							{membership ? ' membership ' : ' booking '}
							will still be confirmed. You can use any valid future date for
							expiry and any valid CVC. Click the button below to copy the test
							card number.
						</Typography>

						<Button
							variant="outlined"
							color="info"
							size="small"
							startIcon={<ContentCopyIcon />}
							onClick={handleCopy}
							sx={{
								bgcolor: 'background.paper',
								borderColor: alpha(theme.palette.info.main, 0.4),
								'&:hover': {
									bgcolor: alpha(theme.palette.info.main, 0.05),
									borderColor: theme.palette.info.main,
								},
								fontFamily: 'monospace',
								letterSpacing: 1,
								fontWeight: 600,
							}}
						>
							{testCardNumber}
						</Button>
					</Box>
				</Box>
			</Paper>
		</Collapse>
	);
};

export default TestPaymentNotice;
