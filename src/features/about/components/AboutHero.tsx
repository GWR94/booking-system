import {
	Box,
	Typography,
	Container,
	Grid2 as Grid,
	useTheme,
	Stack,
	alpha,
} from '@mui/material';
import { AnimateIn } from '@ui';
import { COMPANY_INFO } from '@constants/company';

const AboutHero = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				background: `linear-gradient(180deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[100]} 100%)`,
				pt: { xs: 12, md: 16 },
				pb: 8,
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={6} alignItems="center">
					{/* Text Section */}
					<Grid size={{ xs: 12, md: 6 }}>
						<AnimateIn type="fade-right">
							<Stack spacing={3}>
								<Typography
									variant="overline"
									sx={{
										color: theme.palette.primary.main,
										fontWeight: 700,
										letterSpacing: 2,
										fontSize: '0.9rem',
									}}
								>
									ABOUT US
								</Typography>
								<Typography
									variant="h2"
									component="h1"
									sx={{
										fontWeight: 800,
										color: theme.palette.text.primary,
										lineHeight: 1.1,
									}}
								>
									More Than Just a<br />
									Simulator.
								</Typography>
								<Typography
									variant="h6"
									sx={{
										color: theme.palette.text.secondary,
										fontWeight: 400,
										lineHeight: 1.6,
										fontSize: '1.1rem',
									}}
								>
									Welcome to {COMPANY_INFO.name}. We've reimagined the indoor
									golf experience to bring you the perfect blend of precision
									technology and premium hospitality right here in Maidstone.
								</Typography>
								<Typography
									variant="body1"
									sx={{
										color: theme.palette.text.secondary,
										lineHeight: 1.8,
									}}
								>
									Whether you're looking to dial in your numbers on our TrackMan
									4 bays, compete in global tournaments, or simply unwind with a
									craft beer in our lounge, we've built a space that celebrates
									the modern game. It's not just about hitting balls—it's about
									where you do it.
								</Typography>
							</Stack>
						</AnimateIn>
					</Grid>

					{/* Image Grid / Visuals */}
					<Grid size={{ xs: 12, md: 6 }}>
						<AnimateIn type="fade-left" delay={0.2}>
							<Box
								sx={{
									display: 'grid',
									gridTemplateColumns: 'repeat(12, 1fr)',
									gridTemplateRows: 'repeat(12, 1fr)',
									gap: 2,
									height: { xs: 400, md: 500 },
								}}
							>
								<Box
									component="img"
									src="/services/trackman-monitor.webp"
									alt="Golf Simulator Bay"
									sx={{
										gridColumn: '1 / 9',
										gridRow: '1 / 11',
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										borderRadius: 2,
										boxShadow: 3,
									}}
								/>
								<Box
									component="img"
									src="/services/trackman.webp"
									alt="Bar Area"
									sx={{
										gridColumn: '6 / 13',
										gridRow: '6 / 13',
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										borderRadius: 2,
										boxShadow: 4,
										border: '4px solid white',
										zIndex: 2,
									}}
								/>
							</Box>
						</AnimateIn>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default AboutHero;
