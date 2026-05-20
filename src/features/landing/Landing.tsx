'use client';

import { Box, Skeleton, Container } from '@mui/material';
import { Suspense, lazy } from 'react';
import { LandingHero } from './components';

const Features = lazy(() => import('./components/Features'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const FeaturedCourses = lazy(() => import('./components/FeaturedCourses'));
const MembershipPreview = lazy(() => import('./components/MembershipPreview'));
const ServicesOverview = lazy(() => import('@shared/ServicesOverview'));
const CallToAction = lazy(() => import('@shared/CallToAction'));

const SectionSkeleton = () => (
	<Container sx={{ py: 10 }}>
		<Box sx={{ textAlign: 'center', mb: 4 }}>
			<Skeleton variant="text" width="40%" height={60} sx={{ mx: 'auto' }} />
			<Skeleton variant="text" width="60%" height={30} sx={{ mx: 'auto' }} />
		</Box>
		<Skeleton variant="rectangular" width="100%" height={400} />
	</Container>
);

const Landing = () => {
	return (
		<Box>
			<LandingHero />

			<Suspense fallback={<SectionSkeleton />}>
				<ServicesOverview />
				<FeaturedCourses />
				<Features />
				<MembershipPreview />
				<Testimonials />
				<CallToAction />
			</Suspense>
		</Box>
	);
};

export default Landing;
