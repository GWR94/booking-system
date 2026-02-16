'use client';

import { Box, Skeleton, Container } from '@mui/material';
import { Suspense, lazy } from 'react';
import { StructuredData } from '@layout';
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
			<StructuredData
				data={{
					'@context': 'https://schema.org',
					'@type': 'SportsActivityLocation',
					name: 'The Short Grass',
					image: 'https://golf.jamesgower.dev/hero-image.webp',
					'@id': 'https://golf.jamesgower.dev',
					url: 'https://golf.jamesgower.dev',
					telephone: '', // Add phone if available
					address: {
						'@type': 'PostalAddress',
						streetAddress: 'Unit 4, Example Estate',
						addressLocality: 'Maidstone',
						postalCode: 'ME15 6GQ',
						addressCountry: 'UK',
					},
					geo: {
						'@type': 'GeoCoordinates',
						latitude: 51.272,
						longitude: 0.529,
					},
					openingHoursSpecification: [
						{
							'@type': 'OpeningHoursSpecification',
							dayOfWeek: [
								'Monday',
								'Tuesday',
								'Wednesday',
								'Thursday',
								'Friday',
								'Saturday',
							],
							opens: '10:00',
							closes: '22:00',
						},
					],
					sameAs: [
						'https://www.facebook.com/theshortgrass',
						'https://www.instagram.com/theshortgrass',
					],
					priceRange: '££',
				}}
			/>
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
