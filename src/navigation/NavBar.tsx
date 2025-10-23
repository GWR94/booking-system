import { Home, Info, EventAvailable } from '@mui/icons-material';
import {
	AppBar,
	Container,
	Toolbar,
	Box,
	useTheme,
	alpha,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useMotionValueEvent, useScroll, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import BasketButton from './BasketButton';
import useWindowSize from '../hooks/useWindowSize';
import ThemePicker from './ThemePickerButton';
import DesktopNavigation from './DesktopNavigation';
import DesktopAccountButton from './DesktopAccountButton';
import MobileNavigationMenu from './MobileNavigationMenu';
import Logo from '../components/common/Logo';
import MobileMenuButton from './MobileMenuButton';

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
	const { scrollY } = useScroll();
	const [hidden, setHidden] = useState<boolean>(false);
	const [lastScrollY, setLastScrollY] = useState<number>(0);
	const [menuContent, setMenuContent] = useState<'nav' | 'basket'>('nav');

	const { width } = useWindowSize();
	const isMobile = width < theme.breakpoints.values.md;

	const setMobileNavBarToBasket = () => {
		setMenuContent('basket');
		setIsMenuOpen(!isMenuOpen);
	};

	// Close menu when route changes
	useEffect(() => {
		setIsMenuOpen(false);
	}, [location.pathname]);

	useMotionValueEvent(scrollY, 'change', (latest: number) => {
		// Determine scroll direction
		if (latest > lastScrollY && latest > threshold) {
			// Scrolling down and past threshold
			setHidden(true);
		} else if (latest < lastScrollY) {
			// Scrolling up
			setHidden(false);
		}
		// Update last scroll position
		setLastScrollY(latest);
	});

	return (
		<Box
			sx={{
				background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main} 100%)`,
				minHeight: '70px',
			}}
		>
			<motion.div
				initial={{ y: '-100%' }}
				animate={hidden ? { y: '-100%' } : { y: 0 }}
				transition={{
					duration: 0.8,
					ease: [0.22, 1, 0.36, 1],
				}}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					zIndex: 1000,
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
					<Container maxWidth="xl">
						<Toolbar
							disableGutters
							sx={{
								py: 0.5,
								minHeight: '74px',
							}}
						>
							{/* Mobile Menu Button */}
							<MobileMenuButton
								setMenuContent={setMenuContent}
								isMenuOpen={isMenuOpen}
								setIsMenuOpen={setIsMenuOpen}
							/>

							{/* Logo */}
							<Logo />

							{/* Desktop Navigation */}
							<DesktopNavigation />

							{/* Action Icons */}
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
								<ThemePicker isMobile={isMobile} />
								<BasketButton
									isMobile={isMobile}
									onMobileBasketClick={setMobileNavBarToBasket}
								/>
								<DesktopAccountButton isMobile={isMobile} />
							</Box>
						</Toolbar>
						{/* Mobile Menu */}
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
