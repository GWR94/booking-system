'use client';

import { Fragment } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { Theme } from '@mui/material/styles';

const STEPS = [
	{
		title: 'Choose your plan',
		description:
			'Select a membership plan that suits your needs, sign up, and enjoy exclusive access to our premium golf simulators.',
	},
	{
		title: 'Stay on your terms',
		description:
			'Your membership renews automatically every month, and you can cancel anytime.',
	},
	{
		title: 'Book and play',
		description:
			'Once you have an active membership you will be able to book your sessions included in your membership instantly.',
	},
] as const;

const CIRCLE = 38;

const stepGapY = { xs: 3.5, sm: 4.5 } as const;

const dashedRailSx = (theme: Theme) => ({
	width: 0,
	alignSelf: 'center',
	borderLeft: `2px dashed ${theme.palette.divider}`,
});

const stepCircleSx = (theme: Theme) => ({
	width: CIRCLE,
	height: CIRCLE,
	borderRadius: '50%',
	display: 'grid',
	placeItems: 'center',
	fontWeight: 800,
	fontSize: '0.95rem',
	position: 'relative' as const,
	zIndex: 1,
	color: theme.palette.common.white,
	background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
	boxShadow:
		theme.palette.mode === 'dark'
			? '0 4px 16px rgba(0,0,0,0.4)'
			: '0 4px 14px rgba(0,0,0,0.12)',
});

const MembershipSteps = () => {
	const theme = useTheme();
	const isMdUp = useMediaQuery(theme.breakpoints.up('md'), {
		noSsr: true,
	});

	return (
		<Box
			component="section"
			aria-label="Membership steps"
			sx={{
				width: '100%',
				boxSizing: 'border-box',
				py: { xs: 4, sm: 5 },
				my: { xs: 4, md: 6 },
			}}
		>
			{!isMdUp ? (
				<Box
					sx={{
						maxWidth: 720,
						mx: 'auto',
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					{STEPS.map((step, index) => (
						<Fragment key={step.title}>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'stretch',
									gap: { xs: 2, sm: 2.5 },
								}}
							>
								<Box
									sx={{
										width: CIRCLE,
										flexShrink: 0,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										minHeight: 0,
									}}
								>
									<Box
										sx={{
											flex: 1,
											minHeight: 0,
											...(index > 0 ? dashedRailSx(theme) : {}),
										}}
									/>
									<Box sx={stepCircleSx(theme)}>{index + 1}</Box>
									<Box
										sx={{
											flex: 1,
											minHeight: 0,
											...(index < STEPS.length - 1 ? dashedRailSx(theme) : {}),
										}}
									/>
								</Box>
								<Box
									sx={{
										flex: 1,
										minWidth: 0,
										textAlign: 'center',
										py: 0.25,
									}}
								>
									<Typography
										variant="subtitle1"
										component="h3"
										sx={{
											fontWeight: 700,
											color: 'text.primary',
											mb: 1.25,
											lineHeight: 1.35,
											textAlign: 'center',
										}}
									>
										{step.title}
									</Typography>
									<Typography
										variant="body1"
										color="text.secondary"
										sx={{
											fontWeight: 400,
											fontSize: { xs: '1.0625rem', sm: '1.125rem' },
											lineHeight: 1.8,
											textAlign: 'center',
										}}
									>
										{step.description}
									</Typography>
								</Box>
							</Box>
							{index < STEPS.length - 1 ? (
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										gap: { xs: 2, sm: 2.5 },
									}}
								>
									<Box
										sx={{
											width: CIRCLE,
											flexShrink: 0,
											display: 'flex',
											justifyContent: 'center',
										}}
									>
										<Box
											sx={{
												...dashedRailSx(theme),
												height: {
													xs: theme.spacing(stepGapY.xs),
													sm: theme.spacing(stepGapY.sm),
												},
											}}
										/>
									</Box>
									<Box sx={{ flex: 1, minWidth: 0 }} aria-hidden />
								</Box>
							) : null}
						</Fragment>
					))}
				</Box>
			) : (
				<Box sx={{ mx: 'auto', width: '100%' }}>
					<Box sx={{ position: 'relative', mb: 4 }}>
						<Box
							sx={{
								position: 'absolute',
								top: CIRCLE / 2 - 1,
								left: 'calc(100% / 6)',
								width: 'calc(100% * 2 / 3)',
								zIndex: 0,
								borderTop: `2px dashed ${theme.palette.divider}`,
							}}
						/>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'flex-start',
								gap: 2,
								position: 'relative',
								zIndex: 1,
							}}
						>
							{STEPS.map((step, index) => (
								<Box
									key={step.title}
									sx={{
										flex: 1,
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<Box sx={stepCircleSx(theme)}>{index + 1}</Box>
								</Box>
							))}
						</Box>
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							gap: 3,
							textAlign: 'center',
						}}
					>
						{STEPS.map((step) => (
							<Box
								key={step.title}
								sx={{
									flex: 1,
									minWidth: 0,
									px: { xs: 0.5, md: 1 },
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'stretch',
								}}
							>
								<Typography
									variant="subtitle1"
									component="h3"
									sx={{
										fontWeight: 700,
										color: 'text.primary',
										mb: 1.25,
										lineHeight: 1.35,
										textAlign: 'center',
										width: '100%',
									}}
								>
									{step.title}
								</Typography>
								<Typography
									variant="body1"
									color="text.secondary"
									sx={{
										fontWeight: 400,
										fontSize: '0.9375rem',
										lineHeight: 1.75,
										textAlign: 'center',
										width: '100%',
									}}
								>
									{step.description}
								</Typography>
							</Box>
						))}
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default MembershipSteps;
