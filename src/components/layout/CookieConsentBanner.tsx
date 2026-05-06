'use client';

import {
	Box,
	Button,
	Typography,
	Paper,
	Container,
	Stack,
	useTheme,
	alpha,
} from '@mui/material';
import { useCookie } from '@context';
import { useBasket } from '@/hooks';

const CookieConsentBanner = () => {
	const { isConsentSet, acceptAll, rejectAll } = useCookie();
	const theme = useTheme();
	const { basket } = useBasket();

	if (isConsentSet) return null;

	return (
		<Box
			sx={{
				position: 'fixed',
				bottom: basket.length > 0 ? 96 : 0,
				left: 0,
				right: 0,
				zIndex: 9500,
				borderRadius: 0,
				borderTop: `1px solid ${theme.palette.divider}`,
				bgcolor: alpha(theme.palette.background.paper, 0.9),
			}}
		>
			<Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
				<Stack
					direction={{ xs: 'column', md: 'row' }}
					spacing={{ xs: 2, md: 3 }}
					alignItems="center"
					justifyContent="space-between"
				>
					<Box>
						<Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
							We respect your privacy
						</Typography>
						<Typography variant="body2" color="text.secondary">
							We use cookies to analyze website traffic and optimize your
							website experience. By accepting our use of cookies, your data
							will be aggregated with all other user data.
						</Typography>
					</Box>
					<Stack direction="row" spacing={2} sx={{ minWidth: 'fit-content' }}>
						<Button variant="contained" color="primary" onClick={acceptAll}>
							Accept
						</Button>
						<Button variant="outlined" color="inherit" onClick={rejectAll}>
							Decline
						</Button>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
};

export default CookieConsentBanner;
