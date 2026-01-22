import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
	Grid2 as Grid,
	Paper,
	MenuList,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Typography,
	Box,
	Container,
	Avatar,
	alpha,
	useTheme,
	Breadcrumbs,
	Link,
} from '@mui/material';
import {
	Logout as LogoutIcon,
	ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useAuth } from '@hooks';
import { NavBar, Footer, SEO } from '@layout';
import { PROFILE_MENU_ITEMS } from '@layout';

const ProfileLayout = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const location = useLocation();
	const { logout, user } = useAuth();

	const currentPath = location.pathname;

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase();
	};

	const getActiveLabel = () => {
		const activeItem = PROFILE_MENU_ITEMS.find(
			(item) => item.path === currentPath,
		);
		return activeItem ? activeItem.label : 'Profile';
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
				bgcolor: 'grey.50',
			}}
		>
			<NavBar />
			<SEO
				title={`${getActiveLabel()} - Profile`}
				description="Manage your profile, bookings, and settings at The Short Grass."
				type="profile"
			/>

			<Box
				sx={{
					background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
					color: 'white',
					pt: 6,
					pb: 12,
					mb: -8,
				}}
			>
				<Container>
					<Breadcrumbs
						separator={<ChevronRightIcon fontSize="small" />}
						sx={{ color: alpha('#fff', 0.7), mb: 3 }}
					>
						<Link
							color="inherit"
							onClick={() => navigate('/')}
							sx={{
								cursor: 'pointer',
								textDecoration: 'none',
								'&:hover': { textDecoration: 'underline' },
							}}
						>
							Home
						</Link>
						<Typography color="white">Profile</Typography>
						{currentPath !== '/profile/overview' && (
							<Typography color="white">{getActiveLabel()}</Typography>
						)}
					</Breadcrumbs>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
						<Avatar
							sx={{
								width: 80,
								height: 80,
								bgcolor: 'accent.main',
								color: 'accent.contrastText',
								fontSize: '2rem',
								fontWeight: 'bold',
								boxShadow: `0 0 0 4px ${alpha('#fff', 0.2)}`,
							}}
						>
							{user?.name ? getInitials(user.name) : 'U'}
						</Avatar>
						<Box>
							<Typography variant="h4" fontWeight="bold">
								{user?.name || 'User'}
							</Typography>
							<Typography variant="body1" sx={{ color: alpha('#fff', 0.8) }}>
								{user?.email}
							</Typography>
						</Box>
					</Box>
				</Container>
			</Box>

			<Container sx={{ flex: 1, pb: 8, position: 'relative', zIndex: 1 }}>
				<Grid container spacing={4}>
					<Grid size={{ xs: 12, md: 3 }}>
						<Paper
							elevation={0}
							sx={{
								width: '100%',
								borderRadius: 3,
								overflow: 'hidden',
								border: '1px solid',
								borderColor: 'divider',
								bgcolor: alpha('#fff', 0.8),
								backdropFilter: 'blur(10px)',
							}}
						>
							<Box
								sx={{
									p: 2.5,
									borderBottom: '1px solid',
									borderColor: 'divider',
									bgcolor: alpha(theme.palette.primary.main, 0.03),
								}}
							>
								<Typography
									variant="subtitle2"
									fontWeight="bold"
									color="text.secondary"
									sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
								>
									Account Settings
								</Typography>
							</Box>
							<MenuList sx={{ py: 1 }}>
								{PROFILE_MENU_ITEMS.map((item) => {
									const isActive = currentPath === item.path;
									return (
										<MenuItem
											key={item.path}
											onClick={() => navigate(item.path)}
											sx={{
												py: 1.5,
												px: 2.5,
												mx: 1,
												borderRadius: 2,
												mb: 0.5,
												transition: 'all 0.2s',
												bgcolor: isActive
													? alpha(theme.palette.primary.main, 0.08)
													: 'transparent',
												color: isActive ? 'primary.main' : 'text.primary',
												'&:hover': {
													bgcolor: isActive
														? alpha(theme.palette.primary.main, 0.12)
														: alpha(theme.palette.primary.main, 0.04),
													transform: 'translateX(4px)',
												},
												'& .MuiListItemIcon-root': {
													color: isActive ? 'primary.main' : 'text.secondary',
													minWidth: 40,
												},
												'& .MuiTypography-root': {
													fontWeight: isActive ? 600 : 500,
												},
											}}
										>
											<ListItemIcon>
												<item.Icon fontSize="small" />
											</ListItemIcon>
											<ListItemText primary={item.label} />
											{isActive && <ChevronRightIcon fontSize="small" />}
										</MenuItem>
									);
								})}

								<Box
									sx={{
										my: 1,
										borderTop: '1px solid',
										borderColor: 'divider',
										mx: 2,
									}}
								/>

								<MenuItem
									onClick={() => logout()}
									sx={{
										py: 1.5,
										px: 2.5,
										mx: 1,
										borderRadius: 2,
										color: 'error.main',
										'&:hover': {
											bgcolor: alpha(theme.palette.error.main, 0.08),
											transform: 'translateX(4px)',
										},
										'& .MuiListItemIcon-root': {
											color: 'error.main',
											minWidth: 40,
										},
									}}
								>
									<ListItemIcon>
										<LogoutIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText
										primary="Logout"
										primaryTypographyProps={{ fontWeight: 500 }}
									/>
								</MenuItem>
							</MenuList>
						</Paper>
					</Grid>

					<Grid size={{ xs: 12, md: 9 }}>
						<Box
							sx={{
								bgcolor: 'white',
								borderRadius: 3,
								p: 4,
								boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
								border: '1px solid',
								borderColor: 'divider',
								minHeight: '400px',
							}}
						>
							<Outlet />
						</Box>
					</Grid>
				</Grid>
			</Container>
			<Footer />
		</Box>
	);
};

export default ProfileLayout;
