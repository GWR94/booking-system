import {
	Box,
	Typography,
	Button,
	useTheme,
	Container,
	Stack,
	Grid2 as Grid,
} from '@mui/material';
import { Diamond } from '@mui/icons-material';
import { AnimateIn } from '@ui';
import { COMPANY_INFO } from '@constants/company';
import HeroMedia from './HeroMedia';
import { useNavigate } from 'react-router-dom';

const LandingHero = () => {
	const theme = useTheme();
	const navigate = useNavigate();

	return (
		<Box
			sx={{
				position: 'relative',
				minHeight: '85vh',
				display: 'flex',
				alignItems: 'center',
				overflow: 'hidden',
				background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main} 100%)`,
				pt: { xs: 12, md: 6 },
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={6} alignItems="center">
					<Grid size={{ xs: 12, md: 6 }}>
						<AnimateIn type="fade-right" style={{ width: '100%' }}>
							<Typography
								variant="overline"
								sx={{
									color: theme.palette.secondary.light,
									fontWeight: 700,
									letterSpacing: 2,
									mb: 2,
									display: 'block',
								}}
							>
								Welcome to {COMPANY_INFO.name}
							</Typography>
							<Typography
								variant="h1"
								component="h1"
								sx={{
									fontWeight: 900,
									fontSize: { xs: '3rem', md: '4.5rem', lg: '5.5rem' },
									lineHeight: 1,
									mb: 3,
									textTransform: 'uppercase',
									color: theme.palette.primary.contrastText,
								}}
							>
								{COMPANY_INFO.tagline}
							</Typography>
							<Typography
								variant="h5"
								color="text.secondary"
								sx={{
									fontWeight: 400,
									mb: 5,
									lineHeight: 1.6,
									maxWidth: 500,
									color: theme.palette.grey[400],
								}}
							>
								Maidstone's premier indoor golf and entertainment venue.
								Experience pure golf on world-class courses, rain or shine.
							</Typography>

							<Stack
								direction={{ xs: 'column', sm: 'row' }}
								spacing={2}
								alignItems={{ xs: 'stretch', sm: 'flex-start' }}
								sx={{ width: '100%' }}
							>
								<Button
									variant="contained"
									color="secondary"
									onClick={() => navigate('/book')}
									sx={{
										px: 4,
										py: 1.5,
										width: { xs: '100%', sm: 'auto' },
									}}
								>
									Book a Session Now
								</Button>
								<Button
									variant="outlined"
									color="accent"
									onClick={() => navigate('/membership')}
									startIcon={<Diamond />}
									sx={{
										px: 4,
										py: 1.5,
										borderWidth: 2,
										background: 'rgba(255, 215, 0, 0.1)',
										borderColor: theme.palette.accent.main,
										width: { xs: '100%', sm: 'auto' },
										'&:hover': {
											background: 'rgba(255, 215, 0, 0.2)',
											borderWidth: 2,
										},
									}}
								>
									View Plans
								</Button>
							</Stack>
						</AnimateIn>
					</Grid>

					<Grid
						size={{ xs: 12, md: 6 }}
						sx={{ display: { xs: 'none', md: 'block' } }}
					>
						<HeroMedia />
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default LandingHero;
