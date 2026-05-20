'use client';

import { Check as CheckIcon } from '@mui/icons-material';
import { alpha, Box, Button, Stack, Typography, useTheme } from '@mui/material';

const HIGHLIGHTS = [
	'Transparent monthly pricing',
	'Secure checkout',
	'Golf & bar discounts',
] as const;

const CallToAction = () => {
	const theme = useTheme();

	return (
		<Box component="section" aria-labelledby="membership-cta-heading">
			<Box
				sx={{
					borderRadius: 4,
					py: 3,
					textAlign: 'center',
					background: alpha(theme.palette.background.paper, 0.72),
					backdropFilter: 'blur(12px)',
					border: `1px solid ${theme.palette.divider}`,
					boxShadow:
						theme.palette.mode === 'dark'
							? '0 8px 32px rgba(0,0,0,0.35)'
							: '0 8px 32px rgba(0,0,0,0.06)',
				}}
			>
				<Typography
					variant="overline"
					sx={{
						color: 'primary.main',
						fontWeight: 700,
						letterSpacing: 2,
						display: 'block',
						mb: 1.5,
					}}
				>
					Get started
				</Typography>
				<Typography
					id="membership-cta-heading"
					variant="h4"
					component="h2"
					sx={{
						fontWeight: 700,
						color: 'text.primary',
						letterSpacing: '-0.02em',
						mb: 2,
						maxWidth: 420,
						mx: 'auto',
						lineHeight: 1.2,
					}}
				>
					Lock in member rates and priority booking
				</Typography>
				<Typography
					variant="body1"
					color="text.secondary"
					sx={{
						maxWidth: 720,
						mx: 'auto',
						mb: 3,
						lineHeight: 1.75,
						fontSize: { xs: '1rem', sm: '1.0625rem' },
						textWrap: 'pretty',
					}}
				>
					Choose Par, Birdie, or Hole-In-One, complete checkout in a few
					minutes, and start reserving simulator time with your included hours
					and member benefits.
				</Typography>

				<Stack
					component="ul"
					direction={{ xs: 'column', sm: 'row' }}
					spacing={{ xs: 1.5, sm: 3 }}
					alignItems={{ xs: 'flex-start', sm: 'center' }}
					justifyContent="center"
					sx={{
						listStyle: 'none',
						m: 0,
						mb: 4,
						px: { xs: 0, sm: 2 },
						textAlign: 'left',
					}}
				>
					{HIGHLIGHTS.map((line) => (
						<Box
							component="li"
							key={line}
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								color: 'text.secondary',
								fontSize: { xs: '0.875rem', sm: '0.9375rem' },
								fontWeight: 500,
							}}
						>
							<CheckIcon
								color="primary"
								sx={{ fontSize: 20, flexShrink: 0 }}
								aria-hidden
							/>
							{line}
						</Box>
					))}
				</Stack>

				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						const tiersSection = document.getElementById('membership-tiers');
						tiersSection?.scrollIntoView({
							behavior: 'smooth',
							block: 'start',
						});
					}}
					sx={{
						px: 4,
						py: 1.5,
						fontWeight: 600,
						borderRadius: 2,
						boxShadow: '0 4px 14px 0 rgba(0,0,0,0.25)',
					}}
				>
					{`View plans & subscribe`}
				</Button>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{
						display: 'block',
						mt: 1,
						mx: 'auto',
						fontSize: '0.75rem',
						lineHeight: 1.6,
						fontStyle: 'italic',
					}}
				>
					Takes you to the membership tiers above so you can pick the plan that
					fits you.
				</Typography>
			</Box>
		</Box>
	);
};

export default CallToAction;
