'use client';

import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
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
