'use client';

'use client';

import { useMotionValueEvent, useScroll, motion } from 'framer-motion';
import { Close, Menu } from '@mui/icons-material';
import {
	AppBar,
	Container,
	Toolbar,
	Box,
	useTheme,
	alpha,
	useMediaQuery,
	IconButton,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Basket from './Basket';
import DesktopNavigation from './DesktopNavigation';
import AccountButton from './AccountButton';
import NavBarDropdown from './NavBarDropdown';
import AdminMenuButton from './AdminMenuButton';
import { Logo } from '@ui';
import { NAV_ITEMS } from './menuItems';
import { useAuth } from '@hooks';
import ThemeSwitcher from './ThemeSwitcher';

interface NavBarProps {
	threshold?: number;
}

const NavBar = ({ threshold = 150 }: NavBarProps) => {
	const theme = useTheme();
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [menuContent, setMenuContent] = useState<
		'nav' | 'basket' | 'account' | 'admin' | 'theme'
	>('nav');
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const { scrollY } = useScroll();
	const [hidden, setHidden] = useState(false);
	const { user, isAuthenticated } = useAuth();

	useMotionValueEvent(scrollY, 'change', (latest) => {
		const previous = scrollY.getPrevious() ?? 0;
		const shouldBeHidden = latest > previous && latest > threshold;

		if (shouldBeHidden !== hidden) {
			setHidden(shouldBeHidden);
		}
	});

	const setMobileNavBarToBasket = () => {
		setMenuContent('basket');
		setIsMenuOpen(!isMenuOpen);
	};

	const setMobileNavBarToAccount = () => {
		setMenuContent('account');
		setIsMenuOpen(!isMenuOpen);
	};

	const setMobileNavBarToAdmin = () => {
		setMenuContent('admin');
		setIsMenuOpen(!isMenuOpen);
	};

	const setMobileNavBarToTheme = () => {
		setMenuContent('theme');
		setIsMenuOpen(!isMenuOpen);
	};

	// Close menu when route changes
	useEffect(() => {
		setIsMenuOpen(false);
	}, [pathname]);

	return (
		<Box
			sx={{
				background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main} 100%)`,
				minHeight: '70px',
			}}
		>
			<motion.div
				variants={{
					visible: { y: 0 },
					hidden: { y: '-100%' },
				}}
				animate={hidden ? 'hidden' : 'visible'}
				transition={{ duration: 0.35, ease: 'easeInOut' }}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					zIndex: 10,
					willChange: 'transform',
					transform: 'translateZ(0)',
				}}
			>
				<AppBar
					position="relative"
					elevation={4}
					sx={{
						background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main} 100%)`,
						borderBottom: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
					}}
				>
					<Container maxWidth="lg">
						<Toolbar
							disableGutters
							sx={{
								py: 0.5,
								minHeight: '74px',
								position: 'relative',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: '100%',
							}}
						>
							<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
								<IconButton
									size="large"
									onClick={() => {
										setMenuContent('nav');
										setIsMenuOpen(!isMenuOpen);
									}}
									aria-label="Toggle menu"
									color="inherit"
									edge="start"
									sx={{
										borderRadius: 1.5,
										mr: 1,
										transition: 'all 0.2s ease',
										'&:hover': {
											backgroundColor: alpha(theme.palette.common.white, 0.1),
										},
									}}
								>
									{isMenuOpen ? <Close /> : <Menu />}
								</IconButton>
							</Box>
							<DesktopNavigation navItems={NAV_ITEMS} />
							<Logo
								sx={{
									height: '50px',
									position: 'absolute',
									left: '50%',
									transform: 'translateX(-50%)',
								}}
								logoOnly={useMediaQuery(theme.breakpoints.down('lg'))}
							/>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: { xs: 0, sm: 1, md: 2 },
								}}
							>
								<ThemeSwitcher
									isMobile={isMobile}
									onMobileClick={setMobileNavBarToTheme}
								/>
								<Basket
									isMobile={isMobile}
									onMobileBasketClick={setMobileNavBarToBasket}
								/>
								{isAuthenticated && user?.role === 'admin' && (
									<AdminMenuButton
										isMobile={isMobile}
										onMobileClick={setMobileNavBarToAdmin}
									/>
								)}
								<AccountButton
									isMobile={isMobile}
									onMobileClick={setMobileNavBarToAccount}
								/>
							</Box>
						</Toolbar>
						<NavBarDropdown
							menuContent={menuContent}
							isMenuOpen={isMenuOpen}
							setIsMenuOpen={setIsMenuOpen}
							navItems={NAV_ITEMS}
						/>
					</Container>
				</AppBar>
			</motion.div>
		</Box>
	);
};

export default NavBar;
