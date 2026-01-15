import { useMotionValueEvent, useScroll, motion } from 'framer-motion';
import { Home, Info, EventAvailable, Close, Menu } from '@mui/icons-material';
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
import { useLocation } from 'react-router-dom';
import {
	Basket,
	DesktopNavigation,
	DesktopAccountButton,
	MobileNavigationMenu,
} from '@components/navigation';
import { Logo } from '@common';

interface NavBarProps {
	threshold?: number;
}

export type NavItem = {
	name: string;
	path: string;
	icon: React.ReactNode;
};

const navItems: NavItem[] = [
	{ name: 'Home', path: '/', icon: <Home fontSize="small" /> },
	{ name: 'About', path: '/about', icon: <Info fontSize="small" /> },
	{ name: 'Book', path: '/book', icon: <EventAvailable fontSize="small" /> },
];

const NavBar = ({ threshold = 150 }: NavBarProps) => {
	const theme = useTheme();
	const location = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [menuContent, setMenuContent] = useState<'nav' | 'basket'>('nav');
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const { scrollY } = useScroll();
	const [hidden, setHidden] = useState(false);

	useMotionValueEvent(scrollY, 'change', (latest) => {
		const previous = scrollY.getPrevious() ?? 0;
		if (latest > previous && latest > threshold) {
			setHidden(true);
		} else {
			setHidden(false);
		}
	});

	const setMobileNavBarToBasket = () => {
		setMenuContent('basket');
		setIsMenuOpen(!isMenuOpen);
	};

	// Close menu when route changes
	useEffect(() => {
		setIsMenuOpen(false);
	}, [location.pathname]);

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
							<DesktopNavigation navItems={navItems} />
							<Logo
								sx={{
									height: '50px',
									position: 'absolute',
									left: '50%',
									transform: 'translateX(-50%)',
								}}
							/>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Basket
									isMobile={isMobile}
									onMobileBasketClick={setMobileNavBarToBasket}
								/>
								<DesktopAccountButton isMobile={isMobile} />
							</Box>
						</Toolbar>
						<MobileNavigationMenu
							menuContent={menuContent}
							isMenuOpen={isMenuOpen}
							setIsMenuOpen={setIsMenuOpen}
							navItems={navItems}
						/>
					</Container>
				</AppBar>
			</motion.div>
		</Box>
	);
};

export default NavBar;
