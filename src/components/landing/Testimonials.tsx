import {
	Box,
	Container,
	Typography,
	Grid2 as Grid,
	Card,
	CardContent,
	Avatar,
	Rating,
	useTheme,
	alpha,
	Stack,
	Chip,
	Divider,
} from '@mui/material';
import { FormatQuote, Verified } from '@mui/icons-material';
import AnimateIn from '../common/AnimateIn';

// Enhanced testimonial data with additional details
const testimonials = [
	{
		name: 'James Wilson',
		position: 'Amateur Golfer',
		handicap: '9',
		quote:
			"The best simulator experience I've found in Kent. TrackMan technology has helped me identify and fix flaws in my swing that I never knew existed.",
		avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
		stars: 5,
		verified: true,
	},
	{
		name: 'Sarah Mitchell',
		position: 'Club Player',
		handicap: '12',
		quote:
			'Perfect for practicing year-round regardless of weather. The data insights are incredible - my driving accuracy has improved dramatically in just a month.',
		avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
		stars: 5,
		verified: true,
	},
	{
		name: 'Robert Johnson',
		position: 'Golf Enthusiast',
		handicap: '16',
		quote:
			'As a beginner, I was intimidated at first, but the staff are incredibly supportive. Playing virtual courses has helped me prepare for real games.',
		avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
		stars: 4,
		verified: true,
	},
];

const Testimonials = () => {
	const theme = useTheme();

	return (
		<Box
			id="testimonials-section"
			sx={{
				py: { xs: 8, md: 12 },
				background: `linear-gradient(to bottom, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
				position: 'relative',
				overflow: 'hidden',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: '100%',
					background: `radial-gradient(circle at 50% 50%, ${alpha(
						theme.palette.primary.main,
						0.2,
					)} 0%, transparent 70%)`,
					zIndex: 1,
				},
			}}
		>
			<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
				<Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
					<Typography
						variant="h3"
						gutterBottom
						sx={{
							fontWeight: 700,
							color: theme.palette.primary.main,
							fontSize: { xs: '2.5rem', md: '3rem' },
						}}
					>
						What Our Customers Say
					</Typography>

					<Typography
						variant="h6"
						color="text.secondary"
						sx={{
							maxWidth: 700,
							mx: 'auto',
							fontWeight: 400,
							mb: 2,
						}}
					>
						Join hundreds of satisfied golfers who've improved their game with
						our premium simulators
					</Typography>

					<Box
						sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}
					>
						<Rating
							value={4.9}
							precision={0.1}
							readOnly
							sx={{ color: theme.palette.secondary.main }}
						/>
						<Typography variant="body2" fontWeight={500} color="text.secondary">
							4.9/5 from over 200 reviews
						</Typography>
					</Box>
				</Box>

				<Grid container spacing={4} sx={{ mt: 4 }}>
					{testimonials.map((testimonial, i) => (
						<Grid size={{ xs: 12, md: 4 }} key={i}>
							<AnimateIn delay={i * 0.1}>
								<Card
									sx={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										borderRadius: 3,
										boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
										transition: 'transform 0.3s ease, box-shadow 0.3s ease',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
										},
										overflow: 'visible',
										position: 'relative',
									}}
								>
									<FormatQuote
										sx={{
											position: 'absolute',
											color: alpha(theme.palette.primary.main, 0.1),
											fontSize: '6rem',
											top: -15,
											left: -10,
											transform: 'rotate(5deg)',
										}}
									/>

									<CardContent
										sx={{
											flex: 1,
											display: 'flex',
											flexDirection: 'column',
											p: 3,
											zIndex: 2,
										}}
									>
										<Box sx={{ mb: 3 }}>
											<Rating
												value={testimonial.stars}
												readOnly
												size="small"
												sx={{ color: theme.palette.secondary.main }}
											/>
										</Box>

										<Typography
											variant="body1"
											color="text.primary"
											sx={{
												fontStyle: 'italic',
												mb: 3,
												fontWeight: 400,
												lineHeight: 1.6,
												minHeight: 120,
												position: 'relative',
												zIndex: 5,
											}}
										>
											"{testimonial.quote}"
										</Typography>

										<Divider sx={{ mb: 3 }} />

										<Stack direction="row" spacing={2} alignItems="center">
											<Avatar
												src={testimonial.avatar}
												sx={{
													width: 56,
													height: 56,
													border: `2px solid ${alpha(
														theme.palette.primary.main,
														0.2,
													)}`,
												}}
											/>

											<Box sx={{ flex: 1 }}>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														mb: 0.5,
													}}
												>
													<Typography variant="subtitle1" fontWeight={600}>
														{testimonial.name}
													</Typography>
													{testimonial.verified && (
														<Verified
															sx={{
																ml: 1,
																fontSize: '1rem',
																color: theme.palette.secondary.main,
															}}
														/>
													)}
												</Box>

												<Typography
													variant="caption"
													color="text.secondary"
													sx={{ display: 'block' }}
												>
													{testimonial.position} • Handicap:{' '}
													{testimonial.handicap}
												</Typography>
											</Box>
										</Stack>
									</CardContent>
								</Card>
							</AnimateIn>
						</Grid>
					))}
				</Grid>

				<Box
					sx={{
						mt: 6,
						textAlign: 'center',
						pt: 2,
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'center',
						gap: 1,
					}}
				>
					<Chip
						label="TrackMan Certified"
						color="primary"
						variant="outlined"
						size="small"
						sx={{ fontWeight: 500 }}
					/>
					<Chip
						label="Top Rated Facility"
						color="primary"
						variant="outlined"
						size="small"
						sx={{ fontWeight: 500 }}
					/>
					<Chip
						label="Premium Experience"
						color="primary"
						variant="outlined"
						size="small"
						sx={{ fontWeight: 500 }}
					/>
					<Chip
						label="Beginner Friendly"
						color="primary"
						variant="outlined"
						size="small"
						sx={{ fontWeight: 500 }}
					/>
				</Box>
			</Container>
		</Box>
	);
};

export default Testimonials;
