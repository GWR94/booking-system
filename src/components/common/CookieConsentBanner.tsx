import { useState, useEffect } from 'react';
import {
	Box,
	Button,
	Typography,
	Paper,
	Container,
	Stack,
} from '@mui/material';
import ReactGA from 'react-ga4';
import { useTheme } from '@mui/material/styles';

const CookieConsentBanner = () => {
	const [isVisible, setIsVisible] = useState(false);
	const theme = useTheme();

	useEffect(() => {
		const savedConsent = localStorage.getItem('cookieConsent');
		if (!savedConsent) {
			setIsVisible(true);
		}
	}, []);

	const handleUpdateConsent = (status: 'granted' | 'denied') => {
		// Update Google Analytics Consent Mode
		ReactGA.gtag('consent', 'update', {
			ad_storage: status,
			ad_user_data: status,
			ad_personalization: status,
			analytics_storage: status,
		});

		// Save choice to localStorage
		localStorage.setItem(
			'cookieConsent',
			status === 'granted' ? 'accepted' : 'declined',
		);

		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<Paper
			elevation={6}
			sx={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 9999,
				borderRadius: 0,
				borderTop: `1px solid ${theme.palette.divider}`,
				bgcolor: 'background.paper',
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
						<Button
							variant="contained"
							color="primary"
							onClick={() => handleUpdateConsent('granted')}
						>
							Accept
						</Button>
						<Button
							variant="outlined"
							color="inherit"
							onClick={() => handleUpdateConsent('denied')}
						>
							Decline
						</Button>
					</Stack>
				</Stack>
			</Container>
		</Paper>
	);
};

export default CookieConsentBanner;
