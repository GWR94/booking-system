import React from 'react';
import { Box, Container, Typography, Paper, useTheme } from '@mui/material';
import { ContactForm } from '@shared';
import { COMPANY_INFO } from '@constants/company';

const Contact: React.FC = () => {
	const theme = useTheme();

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="xl">
				<Typography
					variant="h3"
					component="h1"
					align="center"
					gutterBottom
					sx={{
						color: theme.palette.primary.main,
						fontWeight: 600,
						mb: 2,
					}}
				>
					Contact Us
				</Typography>

				<Typography
					variant="h6"
					component="h2"
					align="center"
					color="text.secondary"
					sx={{ maxWidth: 700, mx: 'auto', mb: 6 }}
				>
					We're here to help with any questions you might have about our golf
					simulator facilities
				</Typography>

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
									Located just 5 minutes from Central Station
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
									Underground: Central Line to Green Park
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
