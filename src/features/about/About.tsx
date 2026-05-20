'use client';

import { Box, Skeleton, Container } from '@mui/material';
import { Suspense, lazy } from 'react';
import AboutHero from './components/AboutHero';
import PlanYourVisit from './components/PlanYourVisit';
import { SectionHeader } from '@ui';

const BarAndEntertainment = lazy(
	() => import('./components/BarAndEntertainment'),
);
const Team = lazy(() => import('./components/Team'));
const CallToAction = lazy(() => import('@shared/CallToAction'));

const SectionSkeleton = () => (
	<Container sx={{ py: 10 }}>
		<Box sx={{ textAlign: 'center', mb: 4 }}>
			<Skeleton variant="text" width="40%" height={60} sx={{ mx: 'auto' }} />
			<Skeleton variant="text" width="60%" height={30} sx={{ mx: 'auto' }} />
		</Box>
		<Skeleton variant="rectangular" width="100%" height={400} />
		<Skeleton variant="rectangular" width="100%" height={400} />
		<Box sx={{ textAlign: 'center', mb: 4 }}>
			<Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto' }} />
			<Skeleton variant="text" width="40%" height={20} sx={{ mx: 'auto' }} />
		</Box>
	</Container>
);

const About = () => (
	<Box component="main">
		<AboutHero />

		<Suspense fallback={<SectionSkeleton />}>
			<BarAndEntertainment />
			<Team />
			<Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
				<Container maxWidth="xl">
					<SectionHeader
						subtitle="PLAN YOUR VISIT"
						title="Visit, Play, and Stay Connected"
						description="Find us in Maidstone, check opening times, or send us a message using the form below."
						sx={{ mb: 5 }}
					/>
					<PlanYourVisit />
				</Container>
			</Box>
			<CallToAction />
		</Suspense>
	</Box>
);

export default About;
