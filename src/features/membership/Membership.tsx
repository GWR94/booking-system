import { Box, Container, useTheme } from '@mui/material';
import { SectionHeader } from '@ui';
import {
	FAQ as MembershipFAQ,
	Tiers,
	CallToAction,
	HowItWorks,
} from './components';

const Membership = () => {
	const theme = useTheme();

	return (
		<Box sx={{ py: 10, backgroundColor: theme.palette.background.default }}>
			<Container maxWidth="lg">
				<SectionHeader
					subtitle="JOIN THE CLUB"
					title="Membership Plans"
					description="Choose the perfect membership plan to suit your golfing needs and enjoy exclusive perks and benefits."
				/>
				<HowItWorks />
				<Tiers />
				<MembershipFAQ />
				<CallToAction />
			</Container>
		</Box>
	);
};

export default Membership;
