import {
	Box,
	Container,
	Typography,
	Grid2 as Grid,
	Card,
	CardContent,
	CardActions,
	Button,
	useTheme,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const membershipTiers = [
	{
		name: 'Bronze',
		price: '£29.99/month',
		perks: [
			'5 hours of simulator access per month',
			'Access to weekday bookings only',
			'10% discount on additional bookings',
		],
		color: 'bronze',
	},
	{
		name: 'Silver',
		price: '£49.99/month',
		perks: [
			'10 hours of simulator access per month',
			'Access to weekday and weekend bookings',
			'15% discount on additional bookings',
			'Priority booking slots',
		],
		color: 'silver',
	},
	{
		name: 'Gold',
		price: '£79.99/month',
		perks: [
			'Unlimited simulator access',
			'Access to all booking times',
			'20% discount on additional bookings',
			'Priority booking slots',
			'Free monthly coaching session',
		],
		color: 'gold',
	},
];

const Membership = () => {
	const theme = useTheme();

	return (
		<Box sx={{ py: 10, backgroundColor: theme.palette.background.default }}>
			<Container maxWidth="lg">
				{/* Page Header */}
				<Box sx={{ textAlign: 'center', mb: 6 }}>
					<Typography
						variant="h3"
						component="h1"
						gutterBottom
						sx={{
							fontWeight: 700,
							color: theme.palette.primary.main,
							textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
						}}
					>
						Membership Plans
					</Typography>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{
							maxWidth: 700,
							mx: 'auto',
							fontWeight: 400,
						}}
					>
						Choose the perfect membership plan to suit your golfing needs and
						enjoy exclusive perks and benefits.
					</Typography>
				</Box>

				{/* Membership Tiers */}
				<Grid container spacing={4} sx={{ mb: 8 }}>
					{membershipTiers.map((tier, index) => (
						<Grid size={{ xs: 12, md: 4 }} key={index}>
							<Box>
								<Card
									elevation={3}
									sx={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										borderRadius: 3,
										overflow: 'hidden',
										border: `2px solid ${
											tier.color === 'gold'
												? '#FFD700'
												: tier.color === 'silver'
												? '#C0C0C0'
												: '#CD7F32'
										}`,
										transition: 'transform 0.3s ease, box-shadow 0.3s ease',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: 6,
										},
									}}
								>
									<CardContent
										sx={{
											flexGrow: 1,
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'space-between',
										}}
									>
										<Typography
											variant="h5"
											component="h2"
											gutterBottom
											sx={{
												fontWeight: 700,
												color:
													tier.color === 'gold'
														? '#FFD700'
														: tier.color === 'silver'
														? '#C0C0C0'
														: '#CD7F32',
											}}
										>
											{tier.name}
										</Typography>
										<Typography
											variant="h6"
											sx={{
												fontWeight: 600,
												color: theme.palette.text.primary,
												mb: 2,
											}}
										>
											{tier.price}
										</Typography>
										<Box>
											{tier.perks.map((perk, i) => (
												<Typography
													key={i}
													variant="body2"
													color="text.secondary"
													sx={{ mb: 1 }}
												>
													• {perk}
												</Typography>
											))}
										</Box>
									</CardContent>
									<CardActions sx={{ justifyContent: 'center', pb: 2 }}>
										<Button
											variant="contained"
											color="primary"
											size="large"
											sx={{
												px: 4,
												borderRadius: 2,
											}}
										>
											Choose {tier.name}
										</Button>
									</CardActions>
								</Card>
							</Box>
						</Grid>
					))}
				</Grid>

				{/* How It Works Section */}
				<Box sx={{ textAlign: 'center', mb: 8 }}>
					<Typography
						variant="h4"
						component="h2"
						gutterBottom
						sx={{
							fontWeight: 700,
							color: theme.palette.primary.main,
						}}
					>
						How It Works
					</Typography>
					<Typography
						variant="body1"
						color="text.secondary"
						sx={{
							maxWidth: 800,
							mx: 'auto',
							fontWeight: 400,
						}}
					>
						Select a membership plan that suits your needs, sign up, and enjoy
						exclusive access to our premium golf simulators. Your membership
						renews automatically every month, and you can cancel anytime.
					</Typography>
				</Box>

				{/* FAQ Section */}
				<Box sx={{ mb: 8 }}>
					<Typography
						variant="h4"
						component="h2"
						gutterBottom
						sx={{
							fontWeight: 700,
							color: theme.palette.primary.main,
							textAlign: 'center',
						}}
					>
						Frequently Asked Questions
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
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography sx={{ fontWeight: 500 }}>
								Can I cancel my membership anytime?
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								Yes, you can cancel your membership at any time. Your access
								will remain active until the end of the current billing cycle.
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
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography sx={{ fontWeight: 500 }}>
								What happens if I exceed my monthly hours?
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								If you exceed your monthly hours, you can book additional
								simulator time at a discounted rate based on your membership
								tier.
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
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography sx={{ fontWeight: 500 }}>
								Can I upgrade or downgrade my membership?
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								Yes, you can upgrade or downgrade your membership at any time.
								Changes will take effect at the start of the next billing cycle.
							</Typography>
						</AccordionDetails>
					</Accordion>
				</Box>

				{/* Call-to-Action Section */}
				<Box sx={{ textAlign: 'center', mt: 8 }}>
					<Typography
						variant="h4"
						component="h2"
						gutterBottom
						sx={{
							fontWeight: 700,
							color: theme.palette.primary.main,
						}}
					>
						Ready to Elevate Your Game?
					</Typography>
					<Button
						variant="contained"
						color="primary"
						size="large"
						sx={{
							px: 6,
							py: 2,
							borderRadius: 3,
							fontSize: '1.2rem',
						}}
					>
						Join Now
					</Button>
				</Box>
			</Container>
		</Box>
	);
};

export default Membership;
