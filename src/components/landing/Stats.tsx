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
import { motion, Variants } from 'motion/react';
import AbstractBackground from '../../assets/svg/AbstractBackground';

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
	const MotionBox = motion.create(Box);

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: 'easeOut' },
		},
	};

	const staggerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	return (
		<Box
			sx={{
				py: { xs: 8, md: 12 },
				position: 'relative',
				backgroundColor: theme.palette.primary.main,
				overflow: 'hidden',
			}}
		>
			<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
				<MotionBox
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
					variants={staggerVariants}
				>
					<AbstractBackground opacity={0.07} />
					<Grid container spacing={4} justifyContent="center">
						{statsData.map((stat, index) => (
							<Grid size={{ xs: 12, md: 3 }} key={index}>
								<MotionBox
									variants={itemVariants}
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
								</MotionBox>
							</Grid>
						))}
					</Grid>
				</MotionBox>
			</Container>
		</Box>
	);
};

export default Stats;
