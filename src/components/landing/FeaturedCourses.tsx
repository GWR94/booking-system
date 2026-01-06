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

import { Link as RouterLink } from 'react-router-dom';

const featuredCourses = [
	{
		name: 'St. Andrews Links',
		image:
			'https://s7d9.scene7.com/is/image/kohlerhospitality/aae41028_rgb?wid=993',
		location: 'Scotland, UK',
		description:
			'Experience the historic home of golf with our highly accurate simulation of the famous Old Course at St. Andrews.',
	},
	{
		name: 'Pebble Beach',
		image:
			'https://www.pebblebeach.com/content/uploads/Pebble_Beach_Arrowhead_13557_copy-ES.jpg',
		location: 'California, USA',
		description:
			'Play one of the most beautiful courses in the world, featuring stunning ocean views and challenging coastal holes.',
	},
	{
		name: 'Royal County Down',
		image:
			'https://www.royalcountydown.org/images/resources/royalcountydown/new-home-slide-1.jpg',
		location: 'Northern Ireland',
		description:
			'Take on one of the most challenging and picturesque links courses with dramatic dunes and stunning mountain backdrop.',
	},
];

const FeaturedCourses = () => {
	const theme = useTheme();
	return (
		<Container sx={{ textAlign: 'center', py: 10, px: 4 }} maxWidth="xl">
			<Box>
				<Typography
					variant="title"
					sx={{
						fontWeight: 700,
						color: theme.palette.primary.main,
						mb: 4,
					}}
				>
					Featured Courses
				</Typography>
				<Typography
					variant="h6"
					color="text.secondary"
					sx={{
						maxWidth: 700,
						mx: 'auto',
						fontWeight: 400,
						mb: 4,
					}}
				>
					Experience world-class golf courses from the comfort of our premium
					simulator bays
				</Typography>
			</Box>

			<Grid container spacing={2}>
				{featuredCourses.map((course, index) => (
					<Grid size={{ xs: 12, md: 4 }} key={index}>
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
									transition: 'transform 0.3s ease, box-shadow 0.3s ease',
									'&:hover': {
										transform: 'translateY(-8px)',
										boxShadow: 6,
									},
								}}
							>
								<CardMedia
									component="img"
									height="220"
									image={course.image}
									alt={course.name}
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
									<Typography variant="body1">{course.description}</Typography>
								</CardContent>
							</Card>
						</Box>
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
	);
};

export default FeaturedCourses;
