'use client';

import { useMotionValueEvent, useScroll, motion } from 'framer-motion';
import { Close, Menu } from '@mui/icons-material';
import {
	AppBar,
	Button,
	Container,
	Toolbar,
	Box,
	useTheme,
	alpha,
	useMediaQuery,
	IconButton,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Basket from './Basket';
import DesktopNavigation from './DesktopNavigation';
import AccountButton from './AccountButton';
import NavBarDropdown from './NavBarDropdown';
import AdminMenuButton from './AdminMenuButton';
import { Logo } from '@ui';
import { JOIN_NAV_ITEM, NAV_ITEMS, PRIMARY_NAV_ITEMS } from './menuItems';
import { useAuth } from '@hooks';

interface NavBarProps {
	threshold?: number;
}

const NavBar = ({ threshold = 150 }: NavBarProps) => {
	const theme = useTheme();
	const router = useRouter();
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [menuContent, setMenuContent] = useState<
		'nav' | 'basket' | 'account' | 'admin'
	>('nav');

	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const isLgDown = useMediaQuery(theme.breakpoints.down('lg'));

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
								justifyContent: { xs: 'space-between', md: 'flex-start' },
								gap: { md: 1 },
								width: '100%',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									flex: { xs: '0 0 auto', md: '1 1 0' },
									minWidth: 0,
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
								<DesktopNavigation navItems={PRIMARY_NAV_ITEMS} />
							</Box>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flex: { xs: '0 0 auto', md: '0 0 auto' },
									position: { xs: 'absolute', md: 'static' },
									left: { xs: '50%', md: 'auto' },
									transform: { xs: 'translateX(-50%)', md: 'none' },
									zIndex: 1,
								}}
							>
								<Logo
									sx={{
										height: '50px',
									}}
									logoOnly={isLgDown}
								/>
							</Box>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'flex-end',
									gap: { xs: 0, sm: 1, md: 2 },
									flex: { xs: '0 0 auto', md: '1 1 0' },
									minWidth: 0,
								}}
							>
								{user?.membershipStatus !== 'ACTIVE' && (
									<Button
										onClick={() => router.push(JOIN_NAV_ITEM.path)}
										aria-current={
											pathname === JOIN_NAV_ITEM.path ? 'page' : undefined
										}
										sx={{
											display: { xs: 'none', md: 'inline-flex' },
											alignItems: 'center',
											color: 'white',
											minWidth: 'auto',
											px: 1.5,
											py: 0.75,
											fontWeight: pathname === JOIN_NAV_ITEM.path ? 700 : 500,
											position: 'relative',
											borderRadius: 1,
											'&:hover': {
												backgroundColor: alpha(theme.palette.link.light, 0.1),
											},
											'&::after':
												pathname === JOIN_NAV_ITEM.path
													? {
															content: '""',
															position: 'absolute',
															bottom: 0,
															left: '50%',
															width: '40%',
															transform: 'translateX(-50%)',
															height: 3,
															backgroundColor: theme.palette.accent.main,
															borderRadius: 4,
														}
													: {},
										}}
									>
										{JOIN_NAV_ITEM.icon}
										<Box component="span" sx={{ ml: 0.75 }}>
											{JOIN_NAV_ITEM.name}
										</Box>
									</Button>
								)}
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
