import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { motion } from 'motion/react';

const testimonials = [
	{
		name: 'James Wilson',
		handicap: '9 Handicap',
		comment: 'The best simulator experience in Kent!',
		avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
	},
	{
		name: 'Emily Carter',
		handicap: '12 Handicap',
		comment: 'A fantastic facility with top-notch technology!',
		avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
	},
	{
		name: 'Michael Brown',
		handicap: '5 Handicap',
		comment: 'TrackMan technology is a game-changer!',
		avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
	},
];

const TestimonialCarousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	// Automatically cycle through testimonials every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
		}, 5000);

		return () => clearInterval(interval); // Cleanup interval on component unmount
	}, []);

	return (
		<Box
			sx={{
				mt: 3,
				p: 2,
				borderRadius: 2,
				backgroundColor: 'rgba(255,255,255,0.1)',
				backdropFilter: 'blur(10px)',
				border: '1px solid rgba(255,255,255,0.2)',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Testimonial Content */}
			<motion.div
				key={currentIndex}
				initial={{ opacity: 0, x: 100 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -100 }}
				transition={{ duration: 0.5 }}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', height: '60px' }}>
					<Avatar
						src={testimonials[currentIndex].avatar}
						sx={{ mr: 2, width: 56, height: 56 }}
					/>
					<Box>
						<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
							{testimonials[currentIndex].comment}
						</Typography>
						<Typography variant="caption" sx={{ opacity: 0.8 }}>
							{testimonials[currentIndex].name},{' '}
							{testimonials[currentIndex].handicap}
						</Typography>
					</Box>
				</Box>
			</motion.div>
		</Box>
	);
};

export default TestimonialCarousel;
