import { Box } from '@mui/material';
import Features from '../components/landing/Features';
import Hero from '../components/landing/Hero';
import Testimonials from '../components/landing/Testimonials';
import CallToAction from '../components/common/CallToAction';
import BookingPreview from '../components/landing/BookingPreview';
import Stats from '../components/landing/Stats';
import FeaturedCourses from '../components/landing/FeaturedCourses';

const Landing = () => {
	return (
		<Box>
			<Hero />
			<FeaturedCourses />
			<Stats />
			<Testimonials />
			<Features />

			<BookingPreview />
			<CallToAction />
		</Box>
	);
};

export default Landing;
