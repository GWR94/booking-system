import { Person, Logout, Login, HowToReg } from '@mui/icons-material';
import { Box, alpha, Stack, Button, Divider, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import BasketContent from './BasketContent';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { NavItem } from './NavBar';

type MobileNavigationMenuProps = {
	menuContent: 'nav' | 'basket';
	isMenuOpen: boolean;
	setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	navItems: NavItem[];
};

const MobileNavigationMenu = ({
	menuContent,
	isMenuOpen,
	setIsMenuOpen,
	navItems,
}: MobileNavigationMenuProps) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const isActive = (path: string) => location.pathname === path;
	const { isAuthenticated, logout } = useAuth();
	const menuVariants = {
		closed: {
			height: 0,
			opacity: 0,
			transition: {
				height: { duration: 0.3 },
				opacity: { duration: 0.2 },
			},
		},
		open: {
			height: 'auto',
			opacity: 1,
			transition: {
				height: { duration: 0.4 },
				opacity: { duration: 0.3, delay: 0.1 },
			},
		},
	};
	return (
		<AnimatePresence>
			{isMenuOpen && (
				<motion.div
					variants={menuVariants}
					initial="closed"
					animate="open"
					exit="closed"
					style={{
						overflow: 'hidden',
					}}
				>
					<Box
						sx={{
							display: { xs: 'block', md: 'none' },
							borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
						}}
					>
						{menuContent === 'nav' ? (
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
								<Divider
									sx={{
										my: 1,
										borderColor: alpha(theme.palette.common.white, 0.2),
									}}
								/>

								<Button
									fullWidth
									onClick={() => navigate('/profile')}
									startIcon={<Person />}
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
									Profile
								</Button>
								<Button
									fullWidth
									onClick={() =>
										isAuthenticated ? logout() : navigate('/login')
									}
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
										onClick={() => navigate('/register')}
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
						) : (
							<BasketContent onClose={() => setIsMenuOpen(false)} />
						)}
					</Box>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default MobileNavigationMenu;
