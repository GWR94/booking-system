import { Box } from '@mui/material';
import Features from '../components/landing/Features';
import Hero from '../components/landing/Hero';
import Testimonials from '../components/landing/Testimonials';
import CallToAction from '../components/landing/CallToAction';

const Landing = () => {
	return (
		<Box>
			<Hero />
			<Features />
			<Testimonials />
			<CallToAction />
		</Box>
	);
};

export default Landing;
