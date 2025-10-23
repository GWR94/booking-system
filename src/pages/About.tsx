import React from 'react';
import { Box } from '@mui/material';
import CallToAction from '../components/common/CallToAction';
import Intro from '../components/about/Intro';
import OurStory from '../components/about/OurStory';
import WhatWeOffer from '../components/about/WhatWeOffer';
import Features from '../components/landing/Features';
import Team from '../components/about/Team';
import NavBreadcrumb from '@common/NavBreadcrumb';

const About: React.FC = () => {
	return (
		<Box>
			{/* Breadcrumbs navigation */}
			<NavBreadcrumb />

			{/* Intro Section */}
			<Intro />

			{/* Our Story Section */}
			<OurStory />

			{/* Team Section */}
			<Team />

			{/* Features/Benefits Section */}
			<Features />

			{/* What We Offer Section */}
			<WhatWeOffer />

			{/* Call to Action Section */}
			<CallToAction />
		</Box>
	);
};

export default About;
