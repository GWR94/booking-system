'use client';

import {
	Box,
	Typography,
	Container,
	Paper,
	Grid2 as Grid,
	alpha,
	useTheme,
	Breadcrumbs,
	Link,
	Avatar,
	MenuList,
	MenuItem,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import {
	ChevronRight as ChevronRightIcon,
	Logout as LogoutIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@hooks';
import { NavBar, Footer, ADMIN_MENU_ITEMS, SEO } from '@layout';

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = useTheme();
	const router = useRouter();
	const pathname = usePathname();
	const { user, logout } = useAuth();

	const currentPath = pathname;

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase();
	};

	const getActiveLabel = () => {
		const activeItem = ADMIN_MENU_ITEMS.find(
			(item: any) => item.path === currentPath,
		);
		if (activeItem) return activeItem.label;
		if (currentPath === '/admin' || currentPath === '/admin/dashboard')
			return 'Dashboard';
		return 'Admin';
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
				title={`${getActiveLabel()} - Admin`}
				description="Management the Booking System."
			/>

			{/* Header Section */}
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
							onClick={() => router.push('/')}
							sx={{
								cursor: 'pointer',
								textDecoration: 'none',
								'&:hover': { textDecoration: 'underline' },
							}}
						>
							Home
						</Link>
						<Typography color="white">Admin</Typography>
						{currentPath !== '/admin/dashboard' && currentPath !== '/admin' && (
							<Typography color="white">{getActiveLabel()}</Typography>
						)}
					</Breadcrumbs>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
						<Avatar
							sx={{
								width: 80,
								height: 80,
								bgcolor: 'secondary.main',
								color: 'secondary.contrastText',
								fontSize: '2rem',
								fontWeight: 'bold',
								boxShadow: `0 0 0 4px ${alpha('#fff', 0.2)}`,
							}}
						>
							{user?.name ? getInitials(user.name) : 'A'}
						</Avatar>
						<Box>
							<Typography variant="h4" fontWeight="bold">
								Admin Portal
							</Typography>
							<Typography variant="body1" sx={{ color: alpha('#fff', 0.8) }}>
								Managing the Booking System
							</Typography>
						</Box>
					</Box>
				</Container>
			</Box>

			<Container sx={{ flex: 1, pb: 8, position: 'relative', zIndex: 1 }}>
				<Grid container spacing={4}>
					{/* Sidebar */}
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
									Management
								</Typography>
							</Box>
							<MenuList sx={{ py: 1 }}>
								{ADMIN_MENU_ITEMS.map((item: any) => {
									const isActive =
										currentPath === item.path ||
										(item.path === '/admin/dashboard' &&
											currentPath === '/admin');
									return (
										<MenuItem
											key={item.path}
											onClick={() => router.push(item.path)}
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

					{/* Content Area */}
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
							{children}
						</Box>
					</Grid>
				</Grid>
			</Container>
			<Footer />
		</Box>
	);
}
