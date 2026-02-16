'use client';

import {
	Box,
	alpha,
	Stack,
	Button,
	useTheme,
	Collapse,
	Typography,
	Divider,
} from '@mui/material';
import { Logout, Login, HowToReg } from '@mui/icons-material';
import { useAuth } from '@hooks';
import { useUI } from '@context';
import { PROFILE_MENU_ITEMS, ADMIN_MENU_ITEMS } from './menuItems';
import BasketContent from './BasketContent';
import { usePathname, useRouter } from 'next/navigation';
import { NavItem } from './menuItems';
import { themes } from '@config/theme.config';
import { useAppTheme } from '@context';

type NavBarDropdownProps = {
	menuContent: 'nav' | 'basket' | 'account' | 'admin' | 'theme';
	isMenuOpen: boolean;
	setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	navItems: NavItem[];
};

const NavBarDropdown = ({
	menuContent,
	isMenuOpen,
	setIsMenuOpen,
	navItems,
}: NavBarDropdownProps) => {
	const theme = useTheme();
	const pathname = usePathname();
	const router = useRouter();
	const { openAuthModal } = useUI();
	const { isAuthenticated, user, logout } = useAuth();
	const { currentThemeId, setThemeId } = useAppTheme();

	const isActive = (path: string) => pathname === path;

	return (
		<Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
			<Box
				sx={{
					overflow: 'hidden',
				}}
			>
				<Box
					sx={{
						display: { xs: 'block', md: 'none' },
						borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
					}}
				>
					{menuContent === 'nav' && (
						<Stack spacing={1} sx={{ p: 2 }}>
							{navItems.map((item) => (
								<Button
									key={item.name}
									fullWidth
									onClick={() => {
										router.push(item.path);
										setIsMenuOpen(false);
									}}
									startIcon={item.icon}
									sx={{
										color: 'white',
										justifyContent: 'flex-start',
										py: 1.5,
										backgroundColor: isActive(item.path)
											? alpha(theme.palette.secondary.main, 0.15)
											: 'transparent',
										borderLeft: isActive(item.path)
											? `4px solid ${theme.palette.secondary.main}`
											: '4px solid transparent',
										borderRadius: 1,
										'&:hover': {
											backgroundColor: alpha(theme.palette.common.white, 0.1),
										},
									}}
								>
									{item.name}
								</Button>
							))}
						</Stack>
					)}

					{menuContent === 'basket' && (
						<BasketContent onClose={() => setIsMenuOpen(false)} isMobile />
					)}

					{menuContent === 'account' && (
						<Stack spacing={1} sx={{ p: 2 }}>
							{isAuthenticated && (
								<Box sx={{ mb: 2, px: 2 }}>
									<Typography
										variant="subtitle1"
										color="white"
										fontWeight={600}
									>
										{user?.name ?? 'User'}
									</Typography>
									<Typography variant="body2" color="rgba(255,255,255,0.7)">
										{user?.email}
									</Typography>
									<Divider
										sx={{ mt: 1, borderColor: 'rgba(255,255,255,0.1)' }}
									/>
								</Box>
							)}

							{isAuthenticated &&
								PROFILE_MENU_ITEMS.map((item) => (
									<Button
										key={item.path}
										fullWidth
										onClick={() => {
											router.push(item.path);
											setIsMenuOpen(false);
										}}
										startIcon={<item.Icon />}
										sx={{
											color: 'white',
											justifyContent: 'flex-start',
											py: 1.5,
											backgroundColor: isActive(item.path)
												? alpha(theme.palette.secondary.main, 0.15)
												: 'transparent',
											borderLeft: isActive(item.path)
												? `4px solid ${theme.palette.secondary.main}`
												: '4px solid transparent',
											borderRadius: 1,
											'&:hover': {
												backgroundColor: alpha(theme.palette.common.white, 0.1),
											},
										}}
									>
										{item.dropdownLabel || item.label}
									</Button>
								))}

							{isAuthenticated && (
								<Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
							)}

							<Button
								fullWidth
								onClick={() => {
									isAuthenticated ? logout() : openAuthModal('login');
									setIsMenuOpen(false);
								}}
								startIcon={isAuthenticated ? <Logout /> : <Login />}
								sx={{
									color: 'white',
									justifyContent: 'flex-start',
									py: 1.5,
									borderRadius: 1,
									'&:hover': {
										backgroundColor: alpha(theme.palette.common.white, 0.1),
									},
								}}
							>
								{isAuthenticated ? 'Logout' : 'Login'}
							</Button>

							{!isAuthenticated && (
								<Button
									fullWidth
									onClick={() => {
										openAuthModal('register');
										setIsMenuOpen(false);
									}}
									startIcon={<HowToReg />}
									sx={{
										color: 'white',
										justifyContent: 'flex-start',
										py: 1.5,
										borderRadius: 1,
										'&:hover': {
											backgroundColor: alpha(theme.palette.common.white, 0.1),
										},
									}}
								>
									Register
								</Button>
							)}
						</Stack>
					)}
					{menuContent === 'admin' && (
						<Stack spacing={1} sx={{ p: 2 }}>
							<Box sx={{ mb: 1, px: 2 }}>
								<Typography variant="subtitle1" color="white" fontWeight={700}>
									Admin Panel
								</Typography>
								<Divider sx={{ mt: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
							</Box>
							{ADMIN_MENU_ITEMS.map((item) => (
								<Button
									key={item.path}
									fullWidth
									onClick={() => {
										router.push(item.path);
										setIsMenuOpen(false);
									}}
									startIcon={<item.Icon />}
									sx={{
										color: 'white',
										justifyContent: 'flex-start',
										py: 1.5,
										backgroundColor: isActive(item.path)
											? alpha(theme.palette.secondary.main, 0.15)
											: 'transparent',
										borderLeft: isActive(item.path)
											? `4px solid ${theme.palette.secondary.main}`
											: '4px solid transparent',
										borderRadius: 1,
										'&:hover': {
											backgroundColor: alpha(theme.palette.common.white, 0.1),
										},
									}}
								>
									{item.label}
								</Button>
							))}
						</Stack>
					)}
					{menuContent === 'theme' && (
						<Stack spacing={1} sx={{ p: 2 }}>
							<Box sx={{ mb: 1, px: 2 }}>
								<Typography variant="subtitle1" color="white" fontWeight={700}>
									Select Theme
								</Typography>
								<Divider sx={{ mt: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
							</Box>
							{themes.map((t) => (
								<Button
									key={t.id}
									fullWidth
									onClick={() => {
										setThemeId(t.id);
										setIsMenuOpen(false);
									}}
									sx={{
										color: 'white',
										justifyContent: 'flex-start',
										py: 1.5,
										backgroundColor:
											t.id === currentThemeId
												? alpha(theme.palette.secondary.main, 0.15)
												: 'transparent',
										borderLeft:
											t.id === currentThemeId
												? `4px solid ${theme.palette.secondary.main}`
												: '4px solid transparent',
										borderRadius: 1,
										'&:hover': {
											backgroundColor: alpha(theme.palette.common.white, 0.1),
										},
									}}
								>
									<Box sx={{ display: 'flex', mr: 2 }}>
										{[
											t.palette.primary?.main,
											t.palette.secondary?.main,
											t.palette.accent?.main,
											t.palette.error?.main,
											t.palette.warning?.main,
										].map((color, index) => (
											<Box
												key={index}
												sx={{
													width: 20,
													height: 20,
													borderRadius: '50%',
													backgroundColor: color,
													border: `2px solid ${theme.palette.primary.main}`, // Match background for "cutout" effect
													mr: -1,
													zIndex: 5 - index,
												}}
											/>
										))}
									</Box>
									<Typography variant="body2">{t.name}</Typography>
								</Button>
							))}
						</Stack>
					)}
				</Box>
			</Box>
		</Collapse>
	);
};

export default NavBarDropdown;
