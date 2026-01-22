import { Box, Container, useTheme, Grid2 as Grid } from '@mui/material';
import logo from '/logo__dark.webp';
import InformationChips from './InformationChips';
import HeroContent from './HeroContent';
import HeroMedia from './HeroMedia';
import HeroFooter from './HeroFooter';

const Hero = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main} 100%)`,
				color: theme.palette.primary.contrastText,
				py: { xs: 8, md: 12 },
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundImage: `url(${logo})`,
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					backgroundSize: 'contain',
					opacity: 0.05,
					pointerEvents: 'none',
					zIndex: 0,
					willChange: 'transform',
				}}
			/>
			<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
				<Grid container spacing={4} alignItems="center">
					<Grid size={{ xs: 12, md: 7 }}>
						<HeroContent />
					</Grid>

					<Grid size={{ xs: 12, md: 5 }}>
						<HeroMedia />
					</Grid>
				</Grid>

				<InformationChips />
				<HeroFooter />
			</Container>
		</Box>
	);
};

export default Hero;
