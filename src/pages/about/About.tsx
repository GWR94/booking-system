import React from 'react';
import { Box, useTheme } from '@mui/material';
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

			<Box sx={{ bgcolor: theme.palette.grey[50] }}>
				<ServicesOverview />
			</Box>

			<Box sx={{ bgcolor: 'background.paper' }}>
				<BarAndEntertainment />
			</Box>

			<Box sx={{ bgcolor: theme.palette.grey[50] }}>
				<Team />
			</Box>

			<CallToAction />
		</Box>
	);
};

export default About;
