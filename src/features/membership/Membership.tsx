'use client';

import { Box, Container, Skeleton, useTheme } from '@mui/material';
import { SectionHeader } from '@ui';
import { Suspense, lazy } from 'react';

const HowItWorks = lazy(() => import('./components/HowItWorks'));
const PurchaseTiers = lazy(() => import('./components/PurchaseTiers'));
const MembershipSteps = lazy(() => import('./components/MembershipSteps'));
const MembershipFAQ = lazy(() => import('./components/MembershipFAQ'));
const CallToAction = lazy(() => import('./components/CallToAction'));

const SectionSkeleton = () => (
	<Container sx={{ py: 10 }}>
		<Box sx={{ textAlign: 'center', mb: 4 }}>
			<Skeleton variant="text" width="40%" height={60} sx={{ mx: 'auto' }} />
			<Skeleton variant="text" width="60%" height={30} sx={{ mx: 'auto' }} />
		</Box>
		<Skeleton variant="rectangular" width="100%" height={400} />
	</Container>
);

const Membership = () => {
	const theme = useTheme();

	return (
		<Box sx={{ py: 5, backgroundColor: theme.palette.background.default }}>
			<Container maxWidth="lg">
				<SectionHeader
					subtitle="JOIN THE CLUB"
					title="Membership Plans"
					description="Choose the perfect membership plan to suit your golfing needs and enjoy exclusive perks and benefits."
					sx={{ mb: 0 }}
				/>
			</Container>

			<Suspense fallback={<SectionSkeleton />}>
				<Container maxWidth="lg">
					<HowItWorks />
					<PurchaseTiers />
				</Container>
				<Container maxWidth="xl">
					<MembershipSteps />
				</Container>
				<Container maxWidth="lg">
					<MembershipFAQ />
					<CallToAction />
				</Container>
			</Suspense>
		</Box>
	);
};

export default Membership;
