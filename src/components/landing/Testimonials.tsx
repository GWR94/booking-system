import { Star } from '@mui/icons-material';
import {
	Box,
	Container,
	Typography,
	Grid2 as Grid,
	Card,
	CardContent,
	Avatar,
	Rating,
} from '@mui/material';

const testimonials = [
	{
		name: 'John D.',
		quote:
			'Incredible simulator experience. Feels just like being on a real course!',
		avatar: '/path/to/avatar1.jpg',
		stars: 5,
	},
	{
		name: 'Sarah M.',
		quote: 'Great for improving my game. The data tracking is phenomenal.',
		avatar: '/path/to/avatar2.jpg',
		stars: 5,
	},
	{
		name: 'Mike R.',
		quote: 'Perfect spot for golf practice, especially during bad weather.',
		avatar: '/path/to/avatar3.jpg',
		stars: 5,
	},
];

const Testimonials = () => {
	return (
		<Box sx={{ bgcolor: 'grey.100', py: 10 }}>
			<Container>
				<Typography variant="h4" align="center" gutterBottom>
					What Our Golfers Say
				</Typography>
				<Grid container spacing={4} sx={{ mt: 4 }}>
					{testimonials.map((testimonial, i) => (
						<Grid size={{ xs: 12, md: 4 }} key={i}>
							<Card
								sx={{
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<CardContent
									sx={{
										flex: 1,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<Avatar
										src={testimonial.avatar}
										sx={{ width: 80, height: 80, mb: 2 }}
									/>
									<Typography
										variant="body1"
										align="center"
										color="text.secondary"
										sx={{ fontStyle: 'italic', mb: 2 }}
									>
										&ldquo;{testimonial.quote}&ldquo;
									</Typography>
									<Box>
										<Typography variant="subtitle1" align="center">
											{testimonial.name}
										</Typography>
										<Rating
											value={testimonial.stars}
											readOnly
											sx={{ justifyContent: 'center', width: '100%' }}
										/>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

export default Testimonials;
