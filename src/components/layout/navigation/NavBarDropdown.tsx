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
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { NavItem } from './menuItems';

type NavBarDropdownProps = {
	menuContent: 'nav' | 'basket' | 'account' | 'admin';
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
	const navigate = useNavigate();
	const location = useLocation();
	const { openAuthModal } = useUI();
	const { isAuthenticated, user, logout } = useAuth();
	const isActive = (path: string) => location.pathname === path;

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
									onClick={() => navigate(item.path)}
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
											navigate(item.path);
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
										navigate(item.path);
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
				</Box>
			</Box>
		</Collapse>
	);
};

export default NavBarDropdown;
