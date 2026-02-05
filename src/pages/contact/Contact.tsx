import React from 'react';
import { Box, Container, Typography, Paper, useTheme } from '@mui/material';
import { ContactForm } from '@shared';
import { COMPANY_INFO } from '@constants/company';
import { SEO } from '@layout';
import { SectionHeader } from '@ui';

const Contact: React.FC = () => {
	const theme = useTheme();

	return (
		<Box sx={{ py: 4 }}>
			<SEO
				title="Contact Us"
				description={`Get in touch with ${COMPANY_INFO.name}. Located in Maidstone, we offer premium golf simulation experiences.`}
			/>
			<Container maxWidth="xl" sx={{ px: { xs: 0, sm: 0, md: 3 } }}>
				<SectionHeader
					subtitle="GET IN TOUCH"
					title="Contact Us"
					description="We're here to help with any questions you might have about our golf simulator facilities"
				/>

				<ContactForm />

				<Box sx={{ mt: 8 }}>
					<Paper
						elevation={0}
						sx={{
							p: 4,
							borderRadius: 2,
							border: `1px solid ${theme.palette.divider}`,
						}}
					>
						<Typography
							variant="h5"
							gutterBottom
							sx={{ mb: 3, fontWeight: 500 }}
						>
							Find Our Location
						</Typography>
						<Box
							sx={{
								width: '100%',
								height: 400,
								border: 'none',
								borderRadius: 1,
								overflow: 'hidden',
							}}
						>
							<iframe
								src={COMPANY_INFO.googleMapsEmbedUrl}
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title={`${COMPANY_INFO.name} Location`}
							></iframe>
						</Box>

						<Box
							sx={{
								mt: 3,
								display: 'flex',
								justifyContent: 'space-between',
								flexWrap: 'wrap',
								gap: 2,
							}}
						>
							<Box>
								<Typography variant="subtitle1" fontWeight={500}>
									Getting Here
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Located in the heart of Maidstone Town Centre
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Free parking available for all customers
								</Typography>
							</Box>

							<Box>
								<Typography variant="subtitle1" fontWeight={500}>
									Public Transport
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Bus Routes: 14, 36, 42
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Train: Maidstone East or Maidstone West
								</Typography>
							</Box>
						</Box>
					</Paper>
				</Box>
			</Container>
		</Box>
	);
};

export default Contact;
