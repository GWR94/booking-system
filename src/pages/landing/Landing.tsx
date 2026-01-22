import { Box, Skeleton, Container } from '@mui/material';
import { Suspense, lazy } from 'react';
import { SEO, StructuredData } from '@components/layout';

import Hero from './components/hero/Hero';

const Features = lazy(() => import('./components/Features'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Stats = lazy(() => import('./components/Stats'));
const FeaturedCourses = lazy(() => import('./components/FeaturedCourses'));
const MembershipPreview = lazy(() => import('./components/MembershipPreview'));
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
			<SEO
				title="Premium Golf Simulators in Maidstone"
				description="Experience the best indoor golf in Maidstone at The Short Grass. Features TrackMan technology, premium bays, and flexible memberships. Book your sim time today!"
				keywords={[
					'golf simulator',
					'maidstone golf',
					'indoor golf',
					'trackman',
					'golf practice',
				]}
			/>
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
								'Sunday',
							],
							opens: '06:00',
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
			<Hero />
			<Suspense fallback={<SectionSkeleton />}>
				<FeaturedCourses />
				<Features />
				<Stats />
				<MembershipPreview />
				<Testimonials />
				<CallToAction />
			</Suspense>
		</Box>
	);
};

export default Landing;
