import React, { useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Divider,
	Paper,
	useTheme,
	Link,
	Switch,
	FormControlLabel,
	FormGroup,
	Button,
	Stack,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Alert,
} from '@mui/material';
import { ExpandMore, Cookie } from '@mui/icons-material';

const saveCookiePreferences = (preferences: Record<string, boolean>) => {
	//FIXME
	return true;
};

const CookiesPolicy: React.FC = () => {
	const theme = useTheme();
	const currentDate = new Date().toLocaleDateString('en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	// State for cookie preferences
	const [cookiePreferences, setCookiePreferences] = useState({
		essential: true, // Always true, cannot be disabled
		functional: false,
		analytics: false,
		marketing: false,
	});

	const [preferencesUpdated, setPreferencesUpdated] = useState(false);

	const handlePreferenceChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setCookiePreferences({
			...cookiePreferences,
			[event.target.name]: event.target.checked,
		});
		setPreferencesUpdated(false);
	};

	const handleSavePreferences = () => {
		saveCookiePreferences(cookiePreferences);
		setPreferencesUpdated(true);
	};

	const handleAcceptAll = () => {
		const allEnabled = {
			essential: true,
			functional: true,
			analytics: true,
			marketing: true,
		};
		setCookiePreferences(allEnabled);
		saveCookiePreferences(allEnabled);
		setPreferencesUpdated(true);
	};

	const handleRejectNonEssential = () => {
		const essentialOnly = {
			essential: true,
			functional: false,
			analytics: false,
			marketing: false,
		};
		setCookiePreferences(essentialOnly);
		saveCookiePreferences(essentialOnly);
		setPreferencesUpdated(true);
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{preferencesUpdated && (
				<Alert
					severity="success"
					sx={{ mb: 3 }}
					onClose={() => setPreferencesUpdated(false)}
				>
					Your cookie preferences have been saved successfully.
				</Alert>
			)}

			<Paper
				elevation={0}
				sx={{
					p: 4,
					borderRadius: 2,
					border: `1px solid ${theme.palette.divider}`,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
					<Cookie
						sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }}
					/>
					<Typography
						variant="h4"
						component="h1"
						sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
					>
						Cookies Policy
					</Typography>
				</Box>

				<Typography variant="body2" color="text.secondary">
					Last Updated: {currentDate}
				</Typography>

				<Divider sx={{ my: 3 }} />

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						1. About Cookies
					</Typography>
					<Typography variant="body1">
						Cookies are small text files that are stored on your computer or
						mobile device when you visit a website. They allow the website to
						recognize your device and remember if you've been to the website
						before. Cookies are widely used to make websites work more
						efficiently, provide information to the owners of the site, and to
						improve your browsing experience.
					</Typography>
					<Typography variant="body1">
						At The Short Grass, we use cookies and similar technologies to
						distinguish you from other users of our website. This helps us to
						provide you with a good experience when you browse our website and
						also allows us to improve our site.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						2. Types of Cookies We Use
					</Typography>

					<Accordion
						elevation={0}
						disableGutters
						sx={{
							mb: 1,
							border: `1px solid ${theme.palette.divider}`,
							'&:before': { display: 'none' },
							borderRadius: 1,
							overflow: 'hidden',
						}}
					>
						<AccordionSummary expandIcon={<ExpandMore />}>
							<Typography sx={{ fontWeight: 500 }}>
								Essential Cookies
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography variant="body1">
								These cookies are necessary for the website to function and
								cannot be switched off in our systems. They are usually only set
								in response to actions made by you which amount to a request for
								services, such as setting your privacy preferences, logging in
								or filling in forms. These include:
							</Typography>
							<ul>
								<Typography component="li" variant="body1">
									Session cookies for managing user sessions
								</Typography>
								<Typography component="li" variant="body1">
									Authentication cookies to identify you when you log in
								</Typography>
								<Typography component="li" variant="body1">
									Security cookies for security purposes
								</Typography>
							</ul>
							<Typography variant="body1" sx={{ mt: 2 }}>
								You can set your browser to block or alert you about these
								cookies, but some parts of the site will not work if these are
								blocked.
							</Typography>
						</AccordionDetails>
					</Accordion>

					<Accordion
						elevation={0}
						disableGutters
						sx={{
							mb: 1,
							border: `1px solid ${theme.palette.divider}`,
							'&:before': { display: 'none' },
							borderRadius: 1,
							overflow: 'hidden',
						}}
					>
						<AccordionSummary expandIcon={<ExpandMore />}>
							<Typography sx={{ fontWeight: 500 }}>
								Functional Cookies
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography variant="body1">
								These cookies enable the website to provide enhanced
								functionality and personalization. They may be set by us or by
								third party providers whose services we have added to our pages.
								These include:
							</Typography>
							<ul>
								<Typography component="li" variant="body1">
									Cookies that remember your preferences (e.g., language
									settings)
								</Typography>
								<Typography component="li" variant="body1">
									Cookies that remember your bookings or items in your basket
								</Typography>
								<Typography component="li" variant="body1">
									Cookies that help with live chat services
								</Typography>
							</ul>
							<Typography variant="body1" sx={{ mt: 2 }}>
								If you do not allow these cookies, then some or all of these
								features may not function properly.
							</Typography>
						</AccordionDetails>
					</Accordion>

					<Accordion
						elevation={0}
						disableGutters
						sx={{
							mb: 1,
							border: `1px solid ${theme.palette.divider}`,
							'&:before': { display: 'none' },
							borderRadius: 1,
							overflow: 'hidden',
						}}
					>
						<AccordionSummary expandIcon={<ExpandMore />}>
							<Typography sx={{ fontWeight: 500 }}>
								Analytics Cookies
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography variant="body1">
								These cookies allow us to count visits and traffic sources so we
								can measure and improve the performance of our site. They help
								us to know which pages are the most and least popular and see
								how visitors move around the site. These include:
							</Typography>
							<ul>
								<Typography component="li" variant="body1">
									Google Analytics cookies
								</Typography>
								<Typography component="li" variant="body1">
									Performance monitoring cookies
								</Typography>
								<Typography component="li" variant="body1">
									Visitor behavior cookies
								</Typography>
							</ul>
							<Typography variant="body1" sx={{ mt: 2 }}>
								All information these cookies collect is aggregated and
								therefore anonymous. If you do not allow these cookies we will
								not know when you have visited our site, and will not be able to
								monitor its performance.
							</Typography>
						</AccordionDetails>
					</Accordion>

					<Accordion
						elevation={0}
						disableGutters
						sx={{
							mb: 1,
							border: `1px solid ${theme.palette.divider}`,
							'&:before': { display: 'none' },
							borderRadius: 1,
							overflow: 'hidden',
						}}
					>
						<AccordionSummary expandIcon={<ExpandMore />}>
							<Typography sx={{ fontWeight: 500 }}>
								Marketing Cookies
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography variant="body1">
								These cookies may be set through our site by our advertising
								partners. They may be used by those companies to build a profile
								of your interests and show you relevant adverts on other sites.
								These include:
							</Typography>
							<ul>
								<Typography component="li" variant="body1">
									Advertising network cookies
								</Typography>
								<Typography component="li" variant="body1">
									Social media cookies
								</Typography>
								<Typography component="li" variant="body1">
									Remarketing cookies
								</Typography>
							</ul>
							<Typography variant="body1" sx={{ mt: 2 }}>
								These cookies do not store directly personal information, but
								are based on uniquely identifying your browser and internet
								device. If you do not allow these cookies, you will experience
								less targeted advertising.
							</Typography>
						</AccordionDetails>
					</Accordion>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						3. Your Cookie Preferences
					</Typography>
					<Typography variant="body1">
						You can set your cookie preferences below. Note that essential
						cookies cannot be disabled as they are necessary for the website to
						function properly.
					</Typography>

					<Paper
						variant="outlined"
						sx={{
							p: 3,
							mb: 3,
							backgroundColor: theme.palette.background.default,
							borderRadius: 2,
						}}
					>
						<Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
							Manage Cookie Settings
						</Typography>

						<FormGroup>
							<FormControlLabel
								control={
									<Switch
										checked={cookiePreferences.essential}
										name="essential"
										color="primary"
										disabled
									/>
								}
								label={
									<Box>
										<Typography variant="body1" sx={{ fontWeight: 500 }}>
											Essential Cookies
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Required for the website to function properly
										</Typography>
									</Box>
								}
								sx={{ mb: 2 }}
							/>

							<FormControlLabel
								control={
									<Switch
										checked={cookiePreferences.functional}
										onChange={handlePreferenceChange}
										name="functional"
										color="primary"
									/>
								}
								label={
									<Box>
										<Typography variant="body1" sx={{ fontWeight: 500 }}>
											Functional Cookies
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Enhance website functionality and personalization
										</Typography>
									</Box>
								}
								sx={{ mb: 2 }}
							/>

							<FormControlLabel
								control={
									<Switch
										checked={cookiePreferences.analytics}
										onChange={handlePreferenceChange}
										name="analytics"
										color="primary"
									/>
								}
								label={
									<Box>
										<Typography variant="body1" sx={{ fontWeight: 500 }}>
											Analytics Cookies
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Help us understand how visitors interact with the website
										</Typography>
									</Box>
								}
								sx={{ mb: 2 }}
							/>

							<FormControlLabel
								control={
									<Switch
										checked={cookiePreferences.marketing}
										onChange={handlePreferenceChange}
										name="marketing"
										color="primary"
									/>
								}
								label={
									<Box>
										<Typography variant="body1" sx={{ fontWeight: 500 }}>
											Marketing Cookies
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Used for advertising purposes
										</Typography>
									</Box>
								}
							/>
						</FormGroup>

						<Stack direction="row" spacing={2} sx={{ mt: 3 }}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleSavePreferences}
							>
								Save Preferences
							</Button>
							<Button
								variant="outlined"
								color="primary"
								onClick={handleAcceptAll}
							>
								Accept All
							</Button>
							<Button variant="text" onClick={handleRejectNonEssential}>
								Essential Only
							</Button>
						</Stack>
					</Paper>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						4. How to Control and Delete Cookies
					</Typography>
					<Typography variant="body1">
						Most web browsers allow some control of most cookies through the
						browser settings. To find out more about cookies, including how to
						see what cookies have been set and how to manage and delete them,
						visit{' '}
						<Link
							href="https://www.aboutcookies.org"
							target="_blank"
							rel="noopener"
						>
							www.aboutcookies.org
						</Link>{' '}
						or{' '}
						<Link
							href="https://www.allaboutcookies.org"
							target="_blank"
							rel="noopener"
						>
							www.allaboutcookies.org
						</Link>
						.
					</Typography>
					<Typography variant="body1">
						To opt out of being tracked by Google Analytics across all websites,
						visit{' '}
						<Link
							href="https://tools.google.com/dlpage/gaoptout"
							target="_blank"
							rel="noopener"
						>
							https://tools.google.com/dlpage/gaoptout
						</Link>
						.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						5. Changes to Our Cookie Policy
					</Typography>
					<Typography variant="body1">
						We may update our Cookie Policy from time to time. Any changes we
						make to our Cookie Policy in the future will be posted on this page
						and, where appropriate, notified to you by email. Please check back
						frequently to see any updates or changes to our Cookie Policy.
					</Typography>
				</Box>

				<Box>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						6. Contact Us
					</Typography>
					<Typography variant="body1">
						If you have any questions about our Cookie Policy, please contact us
						at:
					</Typography>
					<Typography variant="body1">
						The Short Grass
						<br />
						123 Golf Lane
						<br />
						London, SW1 2AB
						<br />
						United Kingdom
						<br />
						golf@jamesgower.dev
						<br />
						+44 (0) 123 456 7890
					</Typography>
				</Box>
			</Paper>
		</Container>
	);
};

export default CookiesPolicy;
