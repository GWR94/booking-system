import { Box } from '@mui/material';
import TestimonialCarousel from '../TestimonialCarousel';
import { AnimateIn } from '@ui';

const HeroMedia = () => {
	return (
		<Box sx={{ display: { xs: 'none', md: 'block' } }}>
			<AnimateIn delay={0.2} type="fade-left">
				<Box sx={{ position: 'relative', perspective: '1000px' }}>
					<Box
						component="img"
						src="/hero-image.webp"
						alt="Premium Golf Simulator"
						width={512}
						height={512}
						loading="eager"
						fetchpriority="high"
						decoding="async"
						sx={{
							width: '100%',
							borderRadius: 4,
							boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
							transform: 'rotateY(-5deg) rotateX(2deg)',
							transition: 'transform 0.5s ease',
							willChange: 'transform',
							'&:hover': {
								transform: 'rotateY(0deg) rotateX(0deg)',
							},
							mb: { xs: 2, md: -6 },
							position: 'relative',
							zIndex: 1,
							display: 'block',
						}}
					/>
					<Box
						sx={{
							position: 'relative',
							zIndex: 2,
							mx: { md: 4 },
							mt: { xs: -4, md: 0 },
						}}
					>
						<TestimonialCarousel />
					</Box>
				</Box>
			</AnimateIn>
		</Box>
	);
};

export default HeroMedia;
