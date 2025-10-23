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
import { motion, Variants } from 'motion/react';
import { Link as RouterLink } from 'react-router-dom';

const featuredCourses = [
	{
		name: 'St. Andrews Links',
		image:
			'https://2f1a7f9478.visitscotland.net/binaries/content/gallery/visitscotland/cms-images/2022/07/20/st_andrews_old_course_01-1.jpg',
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
	const variant: Variants = {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: 'easeOut' },
		},
	};
	const theme = useTheme();
	const MotionBox = motion.create(Box);
	return (
		<Box sx={{ p: 10 }}>
			<Container maxWidth="lg">
				<MotionBox
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
					variants={variant}
				>
					<Box sx={{ textAlign: 'center', mb: 6 }}>
						<Typography
							variant="h3"
							component="h2"
							gutterBottom
							sx={{
								fontWeight: 700,
								color: theme.palette.primary.main,
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
							}}
						>
							Experience world-class golf courses from the comfort of our
							premium simulator bays
						</Typography>
					</Box>

					<Grid container spacing={2}>
						{featuredCourses.map((course, index) => (
							<Grid size={{ xs: 12, md: 4 }} key={index}>
								<MotionBox
									initial={{ opacity: 0, y: 30 }}
									whileInView={{
										opacity: 1,
										y: 0,
										transition: {
											delay: index * 0.2,
											duration: 0.5,
										},
									}}
									sx={{ height: '100%' }}
									viewport={{ once: true }}
								>
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
												// p: 3,
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
								</MotionBox>
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
							View All Courses
						</Button>
					</Box>
				</MotionBox>
			</Container>
		</Box>
	);
};

export default FeaturedCourses;
