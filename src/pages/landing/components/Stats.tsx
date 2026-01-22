import {
	Box,
	Container,
	Grid2 as Grid,
	Typography,
	useTheme,
} from '@mui/material';
import {
	SportsGolf,
	CalendarMonth,
	Groups,
	EmojiEvents,
} from '@mui/icons-material';
import React from 'react';
import AbstractBackground from '@assets/svg/AbstractBackground';
import { AnimateIn } from '@ui';

const statsData = [
	{
		number: '4',
		label: 'Simulator Bays',
		icon: <SportsGolf fontSize="large" color="accent" />,
	},
	{
		number: '100+',
		label: 'Virtual Courses',
		icon: <CalendarMonth fontSize="large" color="accent" />,
	},
	{
		number: '5,000+',
		label: 'Happy Customers',
		icon: <Groups fontSize="large" color="accent" />,
	},
	{
		number: '24+',
		label: 'Tournaments Hosted',
		icon: <EmojiEvents fontSize="large" color="accent" />,
	},
];

const Stats = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				py: { xs: 8, md: 12 },
				position: 'relative',
				backgroundColor: theme.palette.primary.main,
				overflow: 'hidden',
				borderTop: `2px solid ${theme.palette.accent.main}`,
				borderBottom: `2px solid ${theme.palette.accent.main}`,
			}}
		>
			<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
				<Box>
					<AbstractBackground opacity={0.07} />
					<Grid container spacing={4} justifyContent="center">
						{statsData.map((stat, index) => (
							<Grid size={{ xs: 12, md: 3 }} key={index}>
								<AnimateIn delay={index * 0.1}>
									<Box
										sx={{
											textAlign: 'center',
											py: 2,
											color: theme.palette.primary.contrastText,
										}}
									>
										<Box sx={{ mb: 2 }}>{stat.icon}</Box>
										<Typography
											variant="h3"
											component="p"
											sx={{
												fontWeight: 700,
												mb: 1,
											}}
										>
											{stat.number}
										</Typography>
										<Typography
											variant="h6"
											sx={{
												fontWeight: 500,
												opacity: 0.9,
											}}
										>
											{stat.label}
										</Typography>
									</Box>
								</AnimateIn>
							</Grid>
						))}
					</Grid>
				</Box>
			</Container>
		</Box>
	);
};

export default React.memo(Stats);
