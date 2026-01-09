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
import axios from '../utils/axiosConfig';
import { useSnackbar } from '@context';
import { useState } from 'react';
import { useAuth } from '@hooks';
import { useNavigate } from 'react-router-dom';
import MembershipFAQ from '@components/membership/FAQ';
import Tiers from '@components/membership/Tiers';
import CallToAction from '@components/membership/CallToAction';
import HowItWorks from '@components/membership/HowItWorks';

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
				<HowItWorks />
				<Tiers />
				<MembershipFAQ />
				<CallToAction />
			</Container>
		</Box>
	);
};

export default Membership;
