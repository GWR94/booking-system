import {
	Box,
	Container,
	Typography,
	Grid2 as Grid,
	Card,
	CardMedia,
	CardContent,
	Button,
	useTheme,
} from '@mui/material';
import { SectionHeader, AnimateIn } from '@ui';
import { Link as RouterLink } from 'react-router-dom';

const featuredCourses = [
	{
		name: 'St. Andrews Links',
		image: '/courses/st-andrews.webp',
		location: 'Scotland, UK',
		description:
			'Experience the historic home of golf with our highly accurate simulation of the famous Old Course at St. Andrews.',
	},
	{
		name: 'Pebble Beach',
		image: '/courses/pebble-beach.webp',
		location: 'California, USA',
		description:
			'Play one of the most beautiful courses in the world, featuring stunning ocean views and challenging coastal holes.',
	},
	{
		name: 'Royal County Down',
		image: '/courses/royal-county-down.webp',
		location: 'Northern Ireland',
		description:
			'Take on one of the most challenging and picturesque links courses with dramatic dunes and stunning mountain backdrop.',
	},
];

const FeaturedCourses = () => {
	const theme = useTheme();
	return (
		<Box
			sx={{
				py: 10,
				background: `linear-gradient(180deg, ${theme.palette.grey[200]} 0%, ${theme.palette.grey[100]} 100%)`,
			}}
		>
			<Container sx={{ textAlign: 'center', px: 4 }} maxWidth="xl">
				<SectionHeader
					subtitle="COURSES"
					title="World Famous Venues"
					description="Experience world-class golf courses from the comfort of our premium simulator bays"
				/>

				<Grid container spacing={2}>
					{featuredCourses.map((course, index) => (
						<Grid size={{ xs: 12, md: 4 }} key={index}>
							<AnimateIn
								type="fade-up"
								delay={index * 0.1}
								style={{ height: '100%' }}
							>
								<Box sx={{ height: '100%' }}>
									<Card
										elevation={0}
										sx={{
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											borderRadius: 3,
											justifyContent: 'space-evenly',
											overflow: 'hidden',
											border: `1px solid ${theme.palette.divider}`,
											bgcolor: 'background.paper',
											transition: 'transform 0.3s ease, box-shadow 0.3s ease',
											'&:hover': {
												transform: 'translateY(-8px)',
												boxShadow: 6,
											},
										}}
									>
										<CardMedia
											component="img"
											height="240"
											width="480"
											image={course.image}
											alt={course.name}
											loading="lazy"
											sx={{
												objectFit: 'cover',
											}}
										/>
										<CardContent
											sx={{
												flexGrow: 1,
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'space-evenly',
											}}
										>
											<Typography
												variant="h5"
												component="h3"
												gutterBottom
												sx={{ fontWeight: 600 }}
											>
												{course.name}
											</Typography>
											<Typography
												variant="body2"
												color="primary.main"
												gutterBottom
												sx={{ fontWeight: 500, mb: 2 }}
											>
												{course.location}
											</Typography>
											<Typography variant="body1">
												{course.description}
											</Typography>
										</CardContent>
									</Card>
								</Box>
							</AnimateIn>
						</Grid>
					))}
				</Grid>

				<Box sx={{ textAlign: 'center', mt: 6 }}>
					<Button
						variant="outlined"
						color="primary"
						size="large"
						component={RouterLink}
						to="/book"
						sx={{
							fontWeight: 500,
							px: 4,
							borderRadius: 2,
						}}
					>
						Continue to Booking
					</Button>
				</Box>
			</Container>
		</Box>
	);
};

export default FeaturedCourses;
