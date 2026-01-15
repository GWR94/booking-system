import React from 'react';
import { Box } from '@mui/material';
import { CallToAction } from '@common';
import {
	Intro,
	OurStory,
	WhatWeOffer,
	Features,
	Team,
	MiniFeatures,
	BookingPreview,
} from '@components/about';
import logo from '/GLF-logo.png';

const About: React.FC = () => {
	return (
		<Box
			sx={{
				background: (theme) =>
					`linear-gradient(165deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[300]} 100%)`,
				pt: 10,
			}}
		>
			<Box
				sx={{
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '100%',
						height: '100%',
						backgroundImage: `url(${logo})`,
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						backgroundSize: 'auto 100%',
						opacity: 0.05,
						pointerEvents: 'none',
						zIndex: 0,
					}}
				/>
				<Intro />
				<MiniFeatures />
			</Box>
			<OurStory />
			<Team />
			<Features />
			<WhatWeOffer />
			<BookingPreview />
			<CallToAction />
		</Box>
	);
};

export default About;
