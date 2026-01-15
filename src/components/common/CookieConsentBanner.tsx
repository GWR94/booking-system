import {
	Box,
	Button,
	Typography,
	Paper,
	Container,
	Stack,
	useTheme,
} from '@mui/material';
import { useCookie } from '@context';

const CookieConsentBanner = () => {
	const { isConsentSet, acceptAll, rejectAll } = useCookie();
	const theme = useTheme();

	if (isConsentSet) return null;

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
						<Button variant="contained" color="primary" onClick={acceptAll}>
							Accept
						</Button>
						<Button variant="outlined" color="inherit" onClick={rejectAll}>
							Decline
						</Button>
					</Stack>
				</Stack>
			</Container>
		</Paper>
	);
};

export default CookieConsentBanner;
