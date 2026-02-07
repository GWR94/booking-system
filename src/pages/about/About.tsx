import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { SEO } from '@layout';
import { CallToAction } from '@shared';
import {
	AboutHero,
	ServicesOverview,
	Team,
	BarAndEntertainment,
} from './components';

const About: React.FC = () => {
	const theme = useTheme();

	return (
		<Box sx={{ bgcolor: 'background.default' }}>
			<SEO
				title="About Us"
				description="Learn more about The Short Grass, Maidstone's premier indoor golf simulator venue. Meet our team and discover our story."
			/>
			<AboutHero />

			{/* Services Section - Flowing Gradient */}
			<ServicesOverview />

			{/* Bar & Entertainment - Flowing Gradient */}
			<BarAndEntertainment />

			{/* Team Section - Flowing Gradient */}
			<Team />

			<CallToAction />
		</Box>
	);
};

export default About;
