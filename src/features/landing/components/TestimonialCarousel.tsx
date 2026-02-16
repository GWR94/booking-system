import { useState, useEffect } from 'react';
import {
	Box,
	Avatar,
	Typography,
	IconButton,
	Paper,
	useTheme,
	Rating,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const testimonials = [
	{
		name: 'James Wilson',
		handicap: '9 Handicap',
		comment:
			'The best simulator experience in Kent! The accuracy of the data is incredible.',
		avatar: 'https://randomuser.me/api/portraits/men/32.jpg?size=64',
		stars: 4.5,
	},
	{
		name: 'Emily Carter',
		handicap: '12 Handicap',
		comment:
			'A fantastic facility with top-notch technology! Perfect for winter practice.',
		avatar: 'https://randomuser.me/api/portraits/women/44.jpg?size=64',
		stars: 5,
	},
	{
		name: 'Michael Brown',
		handicap: '5 Handicap',
		comment:
			'TrackMan technology is a game-changer! My game has improved significantly.',
		avatar: 'https://randomuser.me/api/portraits/men/45.jpg?size=64',
		stars: 4.5,
	},
];

const TestimonialCarousel = () => {
	const theme = useTheme();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			nextTestimonial();
		}, 6000);

		return () => clearInterval(timer);
	}, [currentIndex]);

	const nextTestimonial = () => {
		setDirection(1);
		setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
	};

	const prevTestimonial = () => {
		setDirection(-1);
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1,
		);
	};

	const variants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 50 : -50,
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			x: direction < 0 ? 50 : -50,
			opacity: 0,
		}),
	};

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				maxWidth: 600,
				mx: 'auto',
			}}
		>
			<Paper
				elevation={0}
				sx={{
					p: 4,
					borderRadius: 4,
					backgroundColor: 'rgba(20, 20, 20, 0.6)',
					backdropFilter: 'blur(8px)',
					border: `1px solid ${theme.palette.divider}`,
					position: 'relative',
					overflow: 'hidden',
					height: 280,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
				}}
			>
				<FormatQuoteRoundedIcon
					sx={{
						position: 'absolute',
						top: 0,
						right: 0,
						fontSize: 120,
						color: theme.palette.primary.main,
						opacity: 0.3,
						zIndex: 0,
						transform: 'rotate(180deg)',
					}}
				/>

				<AnimatePresence initial={false} custom={direction} mode="wait">
					<motion.div
						key={currentIndex}
						custom={direction}
						variants={variants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							x: { type: 'spring', stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 },
						}}
						style={{
							width: '100%',
							zIndex: 1,
							position: 'relative',
							willChange: 'transform, opacity',
							transform: 'translateZ(0)',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 3,
								justifyContent: 'space-between',
								height: '100%',
							}}
						>
							<Typography
								variant="h6"
								sx={{
									fontWeight: 500,
									fontStyle: 'italic',
									color: 'common.white',
									lineHeight: 1.6,
									fontSize: '1.1rem',
									textShadow: '0 2px 4px rgba(0,0,0,0.3)',
									minHeight: '4.8em',
								}}
							>
								"{testimonials[currentIndex].comment}"
							</Typography>
							<Rating
								value={testimonials[currentIndex].stars}
								readOnly
								precision={0.5}
								size="small"
								sx={{ color: theme.palette.accent.main }}
							/>

							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Avatar
									src={testimonials[currentIndex].avatar}
									alt={testimonials[currentIndex].name}
									sx={{
										width: 56,
										height: 56,
										border: `2px solid ${theme.palette.primary.main}`,
										boxShadow: theme.shadows[4],
									}}
								/>
								<Box>
									<Typography
										variant="subtitle1"
										sx={{ fontWeight: 700, color: 'common.white' }}
									>
										{testimonials[currentIndex].name}
									</Typography>
									<Typography
										variant="caption"
										sx={{
											color: theme.palette.primary.light,
											fontWeight: 600,
											textTransform: 'uppercase',
											letterSpacing: 0.5,
										}}
									>
										{testimonials[currentIndex].handicap}
									</Typography>
								</Box>
							</Box>
						</Box>
					</motion.div>
				</AnimatePresence>

				{/* Navigation Buttons */}
				<Box
					sx={{
						position: 'absolute',
						bottom: 16,
						right: 16,
						display: 'flex',
						gap: 1,
						zIndex: 2,
					}}
				>
					<IconButton
						onClick={prevTestimonial}
						aria-label="Previous testimonial"
						size="small"
						sx={{
							color: 'rgba(255,255,255,0.7)',
							'&:hover': {
								color: 'primary.main',
								bgcolor: 'rgba(255,255,255,0.1)',
							},
						}}
					>
						<NavigateBeforeRoundedIcon />
					</IconButton>
					<IconButton
						onClick={nextTestimonial}
						aria-label="Next testimonial"
						size="small"
						sx={{
							color: 'rgba(255,255,255,0.7)',
							'&:hover': {
								color: 'primary.main',
								bgcolor: 'rgba(255,255,255,0.1)',
							},
						}}
					>
						<NavigateNextRoundedIcon />
					</IconButton>
				</Box>
			</Paper>

			{/* Progress Indicators */}
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
				{testimonials.map((_, index) => (
					<Box
						key={index}
						component={motion.div}
						animate={{
							width: index === currentIndex ? 24 : 8,
							backgroundColor:
								index === currentIndex
									? theme.palette.primary.main
									: theme.palette.text.disabled,
							opacity: index === currentIndex ? 1 : 0.3,
						}}
						onClick={() => {
							setDirection(index > currentIndex ? 1 : -1);
							setCurrentIndex(index);
						}}
						sx={{
							height: 8,
							borderRadius: 4,
							cursor: 'pointer',
							transition: 'background-color 0.3s ease',
						}}
					/>
				))}
			</Box>
		</Box>
	);
};

export default TestimonialCarousel;
