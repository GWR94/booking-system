import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@api';
import {
	Grid,
	Paper,
	Typography,
	Box,
	useTheme,
	Card,
	CardContent,
	Divider,
} from '@mui/material';
import { LoadingSpinner } from '@ui';
import {
	People as PeopleIcon,
	EventNote as EventNoteIcon,
	VerifiedUser as VerifiedUserIcon,
	Today as TodayIcon,
	Cancel as CancelIcon,
	Star as StarIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, gradient }: any) => {
	const theme = useTheme();

	return (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				height: '100%',
				borderRadius: 4,
				border: '1px solid',
				borderColor: 'divider',
				background:
					theme.palette.mode === 'dark'
						? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`
						: `linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)`,
				transition: 'all 0.3s ease-in-out',
				gap: 2,
				'&:hover': {
					transform: 'translateY(-4px)',
					boxShadow: theme.shadows[4],
					borderColor: `${color}.main`,
				},
			}}
		>
			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						fontWeight: 700,
						mb: 0.5,
						textTransform: 'uppercase',
						letterSpacing: 1,
						fontSize: '0.7rem',
					}}
				>
					{title}
				</Typography>
				<Typography variant="h4" component="div" sx={{ fontWeight: 800 }}>
					{value}
				</Typography>
			</Box>
			<Box
				sx={{
					background:
						gradient ||
						`linear-gradient(135deg, ${(theme.palette as any)[color].main} 0%, ${(theme.palette as any)[color].dark} 100%)`,
					color: '#fff',
					p: 1.5,
					borderRadius: 2.5,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: `0 4px 12px 0 rgba(0,0,0,0.1)`,
					flexShrink: 0,
					width: 48,
					height: 48,
				}}
			>
				{icon}
			</Box>
		</Paper>
	);
};

const Dashboard = () => {
	const theme = useTheme();
	const { data: stats, isLoading } = useQuery({
		queryKey: ['adminStats'],
		queryFn: getDashboardStats,
	});

	if (isLoading) return <LoadingSpinner />;

	return (
		<Box sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: { xs: 2, md: 4 } }}>
			<Box sx={{ mb: 6, textAlign: 'center' }}>
				<Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
					Dashboard Overview
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Real-time insights and platform metrics
				</Typography>
			</Box>

			<Typography
				variant="h6"
				sx={{
					mb: 3,
					fontWeight: 700,
					display: 'flex',
					alignItems: 'center',
					gap: 1,
				}}
			>
				<Box
					sx={{
						width: 4,
						height: 24,
						bgcolor: 'primary.main',
						borderRadius: 1,
					}}
				/>
				Key Metrics
			</Typography>

			<Grid container spacing={3} sx={{ mb: 6 }}>
				<Grid item xs={6}>
					<StatCard
						title="Total Users"
						value={stats?.totalUsers || 0}
						icon={<PeopleIcon />}
						color="primary"
					/>
				</Grid>
				<Grid item xs={6}>
					<StatCard
						title="Active Members"
						value={stats?.activeMembers || 0}
						icon={<VerifiedUserIcon />}
						color="success"
					/>
				</Grid>
				<Grid item xs={6}>
					<StatCard
						title="Total Bookings"
						value={stats?.totalBookings || 0}
						icon={<EventNoteIcon />}
						color="info"
					/>
				</Grid>
				<Grid item xs={6}>
					<StatCard
						title="Cancelled"
						value={stats?.cancelledBookings || 0}
						icon={<CancelIcon />}
						color="error"
					/>
				</Grid>
			</Grid>

			<Grid container spacing={4}>
				<Grid item xs={12} md={7}>
					<Paper
						sx={{
							p: 4,
							borderRadius: 4,
							height: '100%',
							border: '1px solid',
							borderColor: 'divider',
						}}
					>
						<Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>
							Today's Activity
						</Typography>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 4,
								flexWrap: { xs: 'wrap', sm: 'nowrap' },
							}}
						>
							<Box
								sx={{
									width: 120,
									height: 120,
									minWidth: 120,
									minHeight: 120,
									borderRadius: '50%',
									border: '8px solid',
									borderColor: 'warning.light',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: theme.shadows[2],
									boxSizing: 'border-box',
									aspectRatio: '1/1',
									flexShrink: 0,
								}}
							>
								<Typography
									variant="h4"
									sx={{ fontWeight: 800, color: 'warning.main' }}
								>
									{stats?.bookingsToday || 0}
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ fontWeight: 600 }}
								>
									BOOKINGS
								</Typography>
							</Box>
							<Box sx={{ flex: 1 }}>
								<Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
									{stats?.bookingsToday > 0 ? 'Busy Day!' : 'Quiet Start'}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									There are {stats?.bookingsToday || 0} bookings scheduled for
									today. Ensure all bays are prepared for the influx of players.
								</Typography>
							</Box>
						</Box>
					</Paper>
				</Grid>

				<Grid item xs={12} md={5}>
					<Paper
						sx={{
							p: 4,
							borderRadius: 4,
							height: '100%',
							border: '1px solid',
							borderColor: 'divider',
						}}
					>
						<Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
							Membership Tiers
						</Typography>
						<Divider sx={{ mb: 3 }} />
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
									<Box
										sx={{
											p: 1,
											borderRadius: 1.5,
											bgcolor: 'grey.100',
											color: 'grey.700',
											display: 'flex',
										}}
									>
										<StarIcon fontSize="small" />
									</Box>
									<Typography sx={{ fontWeight: 600 }}>PAR</Typography>
								</Box>
								<Typography sx={{ fontWeight: 700 }}>
									{stats?.membershipStats?.PAR || 0}
								</Typography>
							</Box>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
									<Box
										sx={{
											p: 1,
											borderRadius: 1.5,
											bgcolor: 'primary.light',
											color: 'primary.main',
											display: 'flex',
										}}
									>
										<StarIcon fontSize="small" />
									</Box>
									<Typography sx={{ fontWeight: 600 }}>BIRDIE</Typography>
								</Box>
								<Typography sx={{ fontWeight: 700 }}>
									{stats?.membershipStats?.BIRDIE || 0}
								</Typography>
							</Box>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
									<Box
										sx={{
											p: 1,
											borderRadius: 1.5,
											bgcolor: 'warning.light',
											color: 'warning.main',
											display: 'flex',
										}}
									>
										<StarIcon fontSize="small" />
									</Box>
									<Typography sx={{ fontWeight: 600 }}>HOLE IN ONE</Typography>
								</Box>
								<Typography sx={{ fontWeight: 700 }}>
									{stats?.membershipStats?.HOLEINONE || 0}
								</Typography>
							</Box>
							{stats?.membershipStats?.NONE > 0 && (
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										mt: 1,
										pt: 1,
										borderTop: '1px dashed',
										borderColor: 'divider',
									}}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
										<Box
											sx={{
												p: 1,
												borderRadius: 1.5,
												bgcolor: 'error.light',
												color: 'error.main',
												display: 'flex',
											}}
										>
											<PeopleIcon fontSize="small" />
										</Box>
										<Typography
											variant="body2"
											sx={{ fontWeight: 600, color: 'text.secondary' }}
										>
											Other (No Tier)
										</Typography>
									</Box>
									<Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>
										{stats?.membershipStats?.NONE}
									</Typography>
								</Box>
							)}
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Dashboard;
