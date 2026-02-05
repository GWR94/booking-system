import { useRef } from 'react';
import {
	Box,
	Container,
	Typography,
	Card,
	CardContent,
	Avatar,
	Rating,
	useTheme,
	alpha,
	Stack,
	IconButton,
	Divider,
} from '@mui/material';
import {
	FormatQuote,
	Verified,
	ArrowBack,
	ArrowForward,
} from '@mui/icons-material';
import { SectionHeader } from '@ui';
import testimonials from '@constants/testimonials';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Swiper styles override
const swiperStyles = `
  .swiper-pagination-bullet-active {
    background-color: #1a1a1a !important;
  }
  .swiper-pagination-bullet {
    background-color: #999;
  }
`;

const Testimonials = () => {
	const theme = useTheme();
	const swiperRef = useRef<any>(null);

	return (
		<Box
			id="testimonials-section"
			sx={{
				py: { xs: 8, md: 12 },
				position: 'relative',
				overflow: 'hidden',
				background: `linear-gradient(to bottom, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%)`,
			}}
		>
			<style>{swiperStyles}</style>
			<Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
				<SectionHeader
					subtitle="REVIEWS"
					title="What Our Customers Say"
					description="Join hundreds of satisfied golfers who've improved their game with our premium simulators"
				/>

				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 1,
						mt: 3,
						mb: 4,
					}}
				>
					<Rating
						value={4.8}
						precision={0.1}
						readOnly
						sx={{ color: theme.palette.accent.main }}
					/>
					<Typography variant="body2" fontWeight={500} color="text.secondary">
						4.8/5 from over 50 reviews
					</Typography>
				</Box>

				<Box sx={{ mx: 'auto', position: 'relative', mt: 4 }}>
					<IconButton
						onClick={() => swiperRef.current?.slidePrev()}
						sx={{
							position: 'absolute',
							top: '180px',
							left: -20,
							zIndex: 10,
							transform: 'translateY(-50%)',
							bgcolor: 'background.paper',
							boxShadow: 2,
							width: 48,
							height: 48,
							display: { xs: 'none', lg: 'flex' },
							'&:hover': { bgcolor: 'background.paper', boxShadow: 4 },
						}}
					>
						<ArrowBack />
					</IconButton>
					<IconButton
						onClick={() => swiperRef.current?.slideNext()}
						sx={{
							position: 'absolute',
							top: '180px',
							right: -20,
							zIndex: 10,
							transform: 'translateY(-50%)',
							bgcolor: 'background.paper',
							boxShadow: 2,
							width: 48,
							height: 48,
							display: { xs: 'none', lg: 'flex' },
							'&:hover': { bgcolor: 'background.paper', boxShadow: 4 },
						}}
					>
						<ArrowForward />
					</IconButton>

					<Box
						sx={{ position: 'relative', minHeight: 450, px: { xs: 0, lg: 4 } }}
					>
						<Swiper
							modules={[Autoplay, Navigation, Pagination]}
							spaceBetween={30}
							slidesPerView={1}
							loop={true}
							autoplay={{
								delay: 6000,
								disableOnInteraction: false,
							}}
							pagination={{
								clickable: true,
								dynamicBullets: true,
							}}
							onBeforeInit={(swiper: any) => {
								swiperRef.current = swiper;
							}}
							breakpoints={{
								600: {
									slidesPerView: 1,
								},
								900: {
									slidesPerView: 2,
								},
								1050: {
									slidesPerView: 3,
								},
								1200: {
									slidesPerView: 4,
								},
							}}
							style={{
								paddingBottom: '50px',
								paddingLeft: '4px',
								paddingRight: '4px',
							}}
						>
							{testimonials.map((testimonial, index) => (
								<SwiperSlide key={index} style={{ height: 'auto' }}>
									<Card
										sx={{
											borderRadius: 4,
											height: '300px',
											display: 'flex',
											flexDirection: 'column',
											boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
											position: 'relative',
											overflow: 'hidden',
											p: { xs: 2, md: 4 },
											bgcolor: 'background.paper',
											border: `1px solid ${theme.palette.divider}`,
										}}
									>
										<FormatQuote
											sx={{
												position: 'absolute',
												color: alpha(theme.palette.secondary.main, 0.1),
												fontSize: '8rem',
												top: -20,
												right: -10,
												transform: 'rotate(10deg)',
												zIndex: 0,
											}}
										/>
										<CardContent
											sx={{
												position: 'relative',
												zIndex: 1,
												display: 'flex',
												flexDirection: 'column',
												height: '100%',
											}}
										>
											<Box
												sx={{
													flexGrow: 1,
													textAlign: 'center',
													mb: 2,
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<Typography
													variant="body1"
													sx={{
														fontStyle: 'italic',
														fontWeight: 400,
														lineHeight: 1.6,
														mb: 2,
														height: 150,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														color: 'text.secondary',
														fontSize: { xs: '0.95rem', md: '1rem' },
														overflow: 'hidden',
														WebkitLineClamp: 6,
														WebkitBoxOrient: 'vertical',
													}}
												>
													"{testimonial.quote}"
												</Typography>
												<Rating
													value={testimonial.stars}
													readOnly
													precision={0.5}
													sx={{ color: theme.palette.accent.main }}
												/>
											</Box>

											<Divider sx={{ mb: 2, mt: 'auto' }} />

											<Stack
												direction="row"
												spacing={2}
												alignItems="center"
												justifyContent="center"
												sx={{ minHeight: 60 }}
											>
												<Avatar
													src={testimonial.avatar}
													sx={{ width: 56, height: 56 }}
												/>
												<Box textAlign="left">
													<Typography
														variant="subtitle1"
														fontWeight={700}
														noWrap
													>
														{testimonial.name}
														{testimonial.verified && (
															<Verified
																sx={{
																	ml: 0.5,
																	fontSize: '1rem',
																	color: theme.palette.primary.main,
																	verticalAlign: 'middle',
																}}
															/>
														)}
													</Typography>
													<Typography
														variant="body2"
														color="text.secondary"
														noWrap
													>
														{testimonial.position} •
														<Typography
															variant="body2"
															component="span"
															color={theme.palette.grey[500]}
															sx={{
																mt: 0.5,
																fontWeight: 500,
																fontSize: '0.8rem',
															}}
														>
															{' '}
															{testimonial.handicap} Handicap
														</Typography>
													</Typography>
												</Box>
											</Stack>
										</CardContent>
									</Card>
								</SwiperSlide>
							))}
						</Swiper>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default Testimonials;
