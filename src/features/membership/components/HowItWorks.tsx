import { StarBorder } from '@mui/icons-material';
import { alpha, Box, Typography } from '@mui/material';

const INTRO_POINTS = [
	'Monthly playing hours included on every plan.',
	'Member savings on food and drinks, plus priority booking windows.',
	'Higher tiers add full weekend access and complimentary club storage.',
] as const;

const HowItWorks = () => {
	return (
		<Box component="section" sx={{ my: { xs: 5, md: 6 } }}>
			<Box
				sx={{
					maxWidth: 'min(40rem, 100%)',
					mx: 'auto',
					mb: { xs: 4, md: 5 },
					px: { xs: 0, sm: 1 },
				}}
			>
				<Box
					component="ul"
					sx={{
						listStyle: 'none',
						m: 0,
						p: 0,
					}}
				>
					{INTRO_POINTS.map((point) => (
						<Box
							component="li"
							key={point}
							sx={{
								display: 'grid',
								gridTemplateColumns: '28px 1fr',
								columnGap: 2,
								alignItems: 'start',
								py: { xs: 1.35, sm: 1.6 },
							}}
						>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'flex-start',
									width: 28,
									flexShrink: 0,
									pt: '0.2em',
									color: 'primary.main',
								}}
							>
								<StarBorder sx={{ fontSize: 22, display: 'block' }} />
							</Box>
							<Typography
								variant="body1"
								color="text.secondary"
								sx={{
									fontSize: { xs: '1rem', sm: '1.0625rem' },
									lineHeight: 1.75,
									textWrap: 'pretty',
								}}
							>
								{point}
							</Typography>
						</Box>
					))}
				</Box>
				<Box
					aria-hidden
					sx={(t) => ({
						mt: { xs: 3.5, md: 4 },
						height: 2,
						maxWidth: 220,
						mx: 'auto',
						borderRadius: 1,
						background: `linear-gradient(90deg, transparent, ${alpha(t.palette.primary.main, 0.5)}, ${alpha(t.palette.secondary.main, 0.35)}, transparent)`,
					})}
				/>
			</Box>
		</Box>
	);
};

export default HowItWorks;
