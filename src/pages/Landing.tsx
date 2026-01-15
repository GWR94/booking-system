import { Box, useTheme } from '@mui/material';
import {
	Features,
	Hero,
	Testimonials,
	Stats,
	FeaturedCourses,
	MembershipPreview,
} from '@components/landing';
import { CallToAction } from '@common';

const Landing = () => {
	const theme = useTheme();
	return (
		<Box>
			<Hero />
			<FeaturedCourses />
			<Features />
			<Stats />
			<MembershipPreview />
			<Testimonials />
			<CallToAction />
		</Box>
	);
};

export default Landing;
