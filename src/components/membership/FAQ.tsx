import {
	Box,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	useTheme,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const MembershipFAQ = () => {
	const theme = useTheme();

	return (
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
						Yes, you can cancel your membership at any time. Your access will
						remain active until the end of the current billing cycle.
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
						If you exceed your monthly hours, you can book additional simulator
						time at a discounted rate based on your membership tier.
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
	);
};

export default MembershipFAQ;
