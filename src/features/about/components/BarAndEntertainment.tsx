import { AnimateIn, SectionHeader } from '@ui';
import {
	Box,
	Typography,
	Grid2 as Grid,
	Container,
	Stack,
	useTheme,
	Button,
	Card,
	CardContent,
} from '@mui/material';
import { LocalBar, LiveTv, Groups, ArrowForward } from '@mui/icons-material';

const BarAndEntertainment = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				pt: 10,
				// Top matches AboutHero bottom (grey[100]); soft dip through grey[200] then back to grey[100] for Team below
				background: `linear-gradient(180deg,
					${theme.palette.grey[100]} 0%,
					${theme.palette.grey[100]} 6%,
					${theme.palette.grey[200]} 22%,
					${theme.palette.grey[100]} 100%)`,
			}}
		>
			<Container maxWidth="xl">
				<Grid
					container
					spacing={6}
					alignItems="center"
					direction={{ xs: 'column-reverse', md: 'row' }}
				>
					<Grid size={{ xs: 12, md: 6 }}>
						<AnimateIn type="fade-right">
							<Box
								component="img"
								src="/services/bar.webp"
								alt="Bar and Lounge Area"
								sx={{
									width: '100%',
									borderRadius: 4,
									boxShadow: 3,
									height: 400,
									objectFit: 'cover',
								}}
							/>
						</AnimateIn>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<AnimateIn type="fade-left">
							<SectionHeader
								subtitle="RELAX & RECHARGE"
								title="Fully Licensed Bar & Entertainment"
								description="The Short Grass isn't just about golf. Think premium simulator bays, quality drinks, and a social venue that works for casual rounds, team nights, and private events."
								maxWidth={1000}
								sx={{ mb: 4 }}
							/>

							<Stack spacing={2} sx={{ mt: 4, mb: 4 }}>
								{[
									{
										title: 'Premium Selection',
										description:
											'From lagers and craft ales to premium spirits and soft drinks, our fully licensed bar has options for every group.',
										icon: <LocalBar fontSize="small" />,
									},
									{
										title: 'Live Sports',
										description:
											'Never miss the action with multiple large 4K screens showing Sky Sports and TNT Sports throughout the week.',
										icon: <LiveTv fontSize="small" />,
									},
									{
										title: 'Social & Corporate Evenings',
										description:
											'Ideal for birthdays, work socials, and golf society nights with simulator play, bar service, and a relaxed lounge setup.',
										icon: <Groups fontSize="small" />,
									},
								].map((item) => (
									<Card
										key={item.title}
										elevation={0}
										sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}
									>
										<CardContent
											sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
										>
											<Box
												sx={{
													width: 40,
													height: 40,
													borderRadius: '50%',
													bgcolor: theme.palette.grey[50],
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: theme.palette.secondary.main,
													flexShrink: 0,
												}}
											>
												{item.icon}
											</Box>
											<Box>
												<Typography
													variant="h6"
													sx={{ fontWeight: 700, mb: 0.5 }}
												>
													{item.title}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													{item.description}
												</Typography>
											</Box>
										</CardContent>
									</Card>
								))}
							</Stack>

							<Box>
								<Button
									variant="text"
									color="primary"
									size="large"
									endIcon={
										<ArrowForward
											className="learn-more-btn"
											sx={{ transition: 'transform 0.2s ease' }}
										/>
									}
									onClick={() => {
										window.location.href = '/about#plan-your-visit';
									}}
									sx={{ borderRadius: 2, px: 4 }}
								>
									Make an Enquiry
								</Button>
							</Box>
						</AnimateIn>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default BarAndEntertainment;
