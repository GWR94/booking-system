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

const Terms: React.FC = () => {
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
					Terms and Conditions
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
						1. Agreement to Terms
					</Typography>
					<Typography variant="body1" gutterBottom>
						These Terms and Conditions constitute a legally binding agreement
						made between you, whether personally or on behalf of an entity
						("you") and The Short Grass ("we," "us" or "our"), concerning your
						access to and use of our website and services.
					</Typography>
					<Typography variant="body1">
						By accessing or using our services, you agree to be bound by these
						Terms. If you disagree with any part of the terms, then you do not
						have permission to access the service.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						2. Booking and Cancellation
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						2.1 Booking Process
					</Typography>
					<Typography variant="body1">
						By making a booking through our platform, you affirm that you are of
						legal age and possess the legal authority to enter into this
						agreement. All bookings are subject to availability and
						confirmation.
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						2.2 Payment Terms
					</Typography>
					<Typography variant="body1">
						Payment in full is required at the time of booking. We accept major
						credit cards and other payment methods as specified on our payment
						page. All prices are listed in GBP and include applicable taxes
						unless otherwise stated.
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						2.3 Cancellation Policy
					</Typography>
					<Typography variant="body1">
						Cancellations made more than 24 hours prior to the scheduled booking
						time will receive a full refund. Cancellations made less than 24
						hours before the scheduled time will incur a 50% cancellation fee.
						No-shows will be charged the full amount with no refund.
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						2.4 Rescheduling
					</Typography>
					<Typography variant="body1">
						Rescheduling requests must be made at least 24 hours before the
						scheduled booking time. Rescheduling is subject to availability and
						may incur additional charges if the new time slot has a higher rate.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						3. Use of Facilities
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						3.1 Conduct
					</Typography>
					<Typography variant="body1">
						Users must conduct themselves in an appropriate manner while using
						our facilities. We reserve the right to refuse service or remove any
						person whose behavior is deemed inappropriate, disruptive, or unsafe
						to themselves or others.
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						3.2 Equipment Use
					</Typography>
					<Typography variant="body1">
						Users are responsible for the proper use of all equipment provided
						in the simulator bays. Any damage caused by improper use or
						negligence will be the financial responsibility of the user.
					</Typography>

					<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
						3.3 Personal Equipment
					</Typography>
					<Typography variant="body1">
						Users may bring their own golf clubs and accessories. We are not
						responsible for any damage, loss, or theft of personal belongings
						brought onto the premises.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						4. Account Registration
					</Typography>
					<Typography variant="body1">
						To access certain features of our service, you may be required to
						register for an account. You agree to provide accurate, current, and
						complete information during the registration process and to update
						such information to keep it accurate, current, and complete.
					</Typography>
					<Typography variant="body1">
						You are responsible for safeguarding the password that you use to
						access the service and for any activities or actions under your
						password. You agree not to disclose your password to any third
						party.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						5. Intellectual Property
					</Typography>
					<Typography variant="body1">
						The Service and its original content, features, and functionality
						are and will remain the exclusive property of The Short Grass and
						its licensors. The Service is protected by copyright, trademark, and
						other laws.
					</Typography>
					<Typography variant="body1">
						Our trademarks and trade dress may not be used in connection with
						any product or service without the prior written consent of The
						Short Grass.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						6. Limitation of Liability
					</Typography>
					<Typography variant="body1">
						In no event shall The Short Grass, nor its directors, employees,
						partners, agents, suppliers, or affiliates, be liable for any
						indirect, incidental, special, consequential or punitive damages,
						including without limitation, loss of profits, data, use, goodwill,
						or other intangible losses, resulting from:
					</Typography>
					<ul>
						<Typography component="li" variant="body1" sx={{ mb: 1 }}>
							Your access to or use of or inability to access or use the
							Service;
						</Typography>
						<Typography component="li" variant="body1" sx={{ mb: 1 }}>
							Any conduct or content of any third party on the Service;
						</Typography>
						<Typography component="li" variant="body1" sx={{ mb: 1 }}>
							Any content obtained from the Service; and
						</Typography>
						<Typography component="li" variant="body1">
							Unauthorized access, use or alteration of your transmissions or
							content, whether based on warranty, contract, tort (including
							negligence) or any other legal theory, whether or not we have been
							informed of the possibility of such damage.
						</Typography>
					</ul>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						7. Indemnification
					</Typography>
					<Typography variant="body1">
						You agree to defend, indemnify and hold harmless The Short Grass and
						its licensee and licensors, and their employees, contractors,
						agents, officers and directors, from and against any and all claims,
						damages, obligations, losses, liabilities, costs or debt, and
						expenses (including but not limited to attorney's fees), resulting
						from or arising out of:
					</Typography>
					<ul>
						<Typography component="li" variant="body1" sx={{ mb: 1 }}>
							Your use and access of the Service, by you or any person using
							your account;
						</Typography>
						<Typography component="li" variant="body1" sx={{ mb: 1 }}>
							A breach of these Terms, or
						</Typography>
						<Typography component="li" variant="body1">
							Your violation of any third-party right, including without
							limitation any intellectual property right, property, or privacy
							right.
						</Typography>
					</ul>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						8. Changes to Terms
					</Typography>
					<Typography variant="body1">
						We reserve the right, at our sole discretion, to modify or replace
						these Terms at any time. If a revision is material, we will provide
						at least 30 days' notice prior to any new terms taking effect. What
						constitutes a material change will be determined at our sole
						discretion.
					</Typography>
					<Typography variant="body1">
						By continuing to access or use our Service after any revisions
						become effective, you agree to be bound by the revised terms. If you
						do not agree to the new terms, you are no longer authorized to use
						the Service.
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						9. Governing Law
					</Typography>
					<Typography variant="body1">
						These Terms shall be governed and construed in accordance with the
						laws of the United Kingdom, without regard to its conflict of law
						provisions.
					</Typography>
					<Typography variant="body1">
						Our failure to enforce any right or provision of these Terms will
						not be considered a waiver of those rights. If any provision of
						these Terms is held to be invalid or unenforceable by a court, the
						remaining provisions of these Terms will remain in effect.
					</Typography>
				</Box>

				<Box>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
					>
						10. Contact Us
					</Typography>
					<Typography variant="body1">
						If you have any questions about these Terms, please contact us at:
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

export default Terms;
