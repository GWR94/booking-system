import React from 'react';
import {
	Box,
	Container,
	Typography,
	Divider,
	Paper,
	useTheme,
} from '@mui/material';
import dayjs from 'dayjs';

const PrivacyPolicy: React.FC = () => {
	const theme = useTheme();
	const currentDate = dayjs().format('Do MMMM YYYY');

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Paper
				elevation={0}
				sx={{
					p: 4,
					borderRadius: 2,
					border: `1px solid ${theme.palette.divider}`,
				}}
			>
				<Typography
					variant="h4"
					component="h1"
					gutterBottom
					sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
				>
					Privacy Policy
				</Typography>

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
						1. Introduction
					</Typography>
					<Typography variant="body1">
						Welcome to GWR Golf Simulators. This Privacy Policy explains how we
						collect, use, disclose, and safeguard your information when you use
						our website and services. Please read this privacy policy carefully.
						If you do not agree with the terms of this privacy policy, please do
						not access the site.
					</Typography>
					<Typography variant="body1">
						We reserve the right to make changes to this Privacy Policy at any
						time and for any reason. Any changes or modifications will be
						effective immediately upon posting the updated Privacy Policy on the
						Site, and you waive the right to receive specific notice of each
						such change.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						2. Information We Collect
					</Typography>
					<Typography variant="body1">
						We may collect information about you in a variety of ways. The
						information we may collect via the Site includes:
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						2.1 Personal Data
					</Typography>
					<Typography variant="body1">
						Personally identifiable information, such as your name, email
						address, telephone number, and billing information that you
						voluntarily give to us when you register with the Site or when you
						choose to participate in various activities related to the Site. You
						are under no obligation to provide us with personal information of
						any kind, however your refusal to do so may prevent you from using
						certain features of the Site.
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						2.2 Derivative Data
					</Typography>
					<Typography variant="body1">
						Information our servers automatically collect when you access the
						Site, such as your IP address, browser type, operating system,
						access times, and the pages you have viewed directly before and
						after accessing the Site.
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						2.3 Financial Data
					</Typography>
					<Typography variant="body1">
						Financial information, such as data related to your payment method
						(e.g., valid credit card number, card brand, expiration date) that
						we may collect when you purchase, order, return, exchange, or
						request information about our services from the Site. We store only
						very limited, if any, financial information that we collect.
						Otherwise, all financial information is stored by our payment
						processor, [Payment Processor Name], and you are encouraged to
						review their privacy policy and contact them directly for responses
						to your questions.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						3. Use of Your Information
					</Typography>
					<Typography variant="body1">
						Having accurate information about you permits us to provide you with
						a smooth, efficient, and customized experience. Specifically, we may
						use information collected about you via the Site to:
					</Typography>
					<ul>
						<Typography component="li" variant="body1">
							Process bookings and transactions.
						</Typography>
						<Typography component="li" variant="body1">
							Create and manage your account.
						</Typography>
						<Typography component="li" variant="body1">
							Send you confirmations, updates, security alerts, and support
							messages.
						</Typography>
						<Typography component="li" variant="body1">
							Respond to your comments, questions, and requests.
						</Typography>
						<Typography component="li" variant="body1">
							Fulfill and manage purchases, orders, and payments.
						</Typography>
						<Typography component="li" variant="body1">
							Prevent fraudulent transactions, monitor against theft, and
							protect against criminal activity.
						</Typography>
					</ul>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						4. Disclosure of Your Information
					</Typography>
					<Typography variant="body1">
						We may share information we have collected about you in certain
						situations. Your information may be disclosed as follows:
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						4.1 By Law or to Protect Rights
					</Typography>
					<Typography variant="body1">
						If we believe the release of information about you is necessary to
						respond to legal process, to investigate or remedy potential
						violations of our policies, or to protect the rights, property, and
						safety of others, we may share your information as permitted or
						required by any applicable law, rule, or regulation.
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						4.2 Third-Party Service Providers
					</Typography>
					<Typography variant="body1">
						We may share your information with third parties that perform
						services for us or on our behalf, including payment processing, data
						analysis, email delivery, hosting services, customer service, and
						marketing assistance.
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						4.3 Business Transfers
					</Typography>
					<Typography variant="body1">
						We may share or transfer your information in connection with, or
						during negotiations of, any merger, sale of company assets,
						financing, or acquisition of all or a portion of our business to
						another company.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						5. Your Rights Under GDPR
					</Typography>
					<Typography variant="body1">
						If you are a resident of the European Economic Area (EEA), you have
						certain data protection rights. We aim to take reasonable steps to
						allow you to correct, amend, delete, or limit the use of your
						Personal Information.
					</Typography>
					<Typography variant="body1">
						Under GDPR, you have the following rights:
					</Typography>
					<ul>
						<Typography component="li" variant="body1">
							The right to access – You have the right to request copies of your
							personal data.
						</Typography>
						<Typography component="li" variant="body1">
							The right to rectification – You have the right to request that we
							correct any information you believe is inaccurate or complete
							information you believe is incomplete.
						</Typography>
						<Typography component="li" variant="body1">
							The right to erasure – You have the right to request that we erase
							your personal data, under certain conditions.
						</Typography>
						<Typography component="li" variant="body1">
							The right to restrict processing – You have the right to request
							that we restrict the processing of your personal data, under
							certain conditions.
						</Typography>
						<Typography component="li" variant="body1">
							The right to object to processing – You have the right to object
							to our processing of your personal data, under certain conditions.
						</Typography>
						<Typography component="li" variant="body1">
							The right to data portability – You have the right to request that
							we transfer the data that we have collected to another
							organization, or directly to you, under certain conditions.
						</Typography>
					</ul>
					<Typography variant="body1" sx={{ mt: 2 }}>
						To exercise any of these rights, please contact us at
						privacy@gwrgolf.com. We will respond to your request within 30 days.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						6. Security of Your Information
					</Typography>
					<Typography variant="body1">
						We use administrative, technical, and physical security measures
						designed to help protect your personal information. While we have
						taken reasonable steps to secure the personal information you
						provide to us, please be aware that despite our efforts, no security
						measures are perfect or impenetrable, and no method of data
						transmission can be guaranteed against any interception or other
						type of misuse.
					</Typography>
					<Typography variant="body1">
						We therefore cannot guarantee its absolute security. However, we are
						committed to implementing reasonable measures to protect your
						information from unauthorized access, disclosure, or destruction.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						7. Cookies and Web Beacons
					</Typography>
					<Typography variant="body1">
						We may use cookies, web beacons, tracking pixels, and other tracking
						technologies to help customize the Site and improve your experience.
						For more information on how we use cookies, please refer to our
						Cookie Policy posted on the Site.
					</Typography>
					<Typography variant="body1">
						Most web browsers are set to accept cookies by default. If you
						prefer, you can usually choose to set your browser to remove or
						reject browser cookies. Please note that removing or rejecting
						cookies could affect the availability and functionality of our Site.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						8. Limitation of Liability
					</Typography>
					<Typography variant="body1">
						To the maximum extent permitted by applicable law, we assume no
						liability or responsibility for any:
					</Typography>
					<ul>
						<Typography component="li" variant="body1">
							Errors, mistakes, or inaccuracies of content;
						</Typography>
						<Typography component="li" variant="body1">
							Personal injury or property damage resulting from your access to
							or use of our service;
						</Typography>
						<Typography component="li" variant="body1">
							Any unauthorized access to or use of our servers and/or any
							personal information stored therein;
						</Typography>
						<Typography component="li" variant="body1">
							Any interruption or cessation of transmission to or from our site;
						</Typography>
						<Typography component="li" variant="body1">
							Any bugs, viruses, or the like that may be transmitted through our
							website by any third party.
						</Typography>
					</ul>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						9. Contact Us
					</Typography>
					<Typography variant="body1">
						If you have questions or comments about this Privacy Policy, please
						contact us at:
					</Typography>
					<Typography variant="body1">
						GWR Golf Simulators
						<br />
						123 Golf Lane
						<br />
						London, SW1 2AB
						<br />
						United Kingdom
						<br />
						privacy@gwrgolf.com
						<br />
						+44 (0) 123 456 7890
					</Typography>
				</Box>
			</Paper>
		</Container>
	);
};

export default PrivacyPolicy;
