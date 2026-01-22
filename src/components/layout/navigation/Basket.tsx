import { useState, useEffect } from 'react';
import { Badge, Box, IconButton, Popover, Tooltip } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useBasket } from '@hooks';
import BasketContent from './BasketContent';
import { useTheme, alpha } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

interface BasketProps {
	isMobile: boolean;
	onMobileBasketClick: () => void;
}

const Basket = ({ isMobile = false, onMobileBasketClick }: BasketProps) => {
	const theme = useTheme();
	const location = useLocation();
	const { basket } = useBasket();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const handleBasketButtonClick = (event: React.MouseEvent<HTMLElement>) => {
		if (isMobile) {
			onMobileBasketClick();
		} else {
			setAnchorEl(event.currentTarget);
		}
	};

	// Close menu on scroll to prevent it from floating detached
	useEffect(() => {
		const handleScroll = () => {
			if (anchorEl) {
				setAnchorEl(null);
			}
		};

		if (anchorEl) {
			window.addEventListener('scroll', handleScroll, { passive: true });
			// Also listen to the main document/body in case of different scrolling context
			document.addEventListener('scroll', handleScroll, { passive: true });
		}

		return () => {
			window.removeEventListener('scroll', handleScroll);
			document.removeEventListener('scroll', handleScroll);
		};
	}, [anchorEl]);

	useEffect(() => {
		setAnchorEl(null);
	}, [location.pathname]);

	const basketButton = (
		<Tooltip title="Your basket" arrow>
			<IconButton
				onClick={handleBasketButtonClick}
				size="large"
				sx={{
					color: theme.palette.link.light,
					borderRadius: 1.5,
					transition: 'all 0.2s',
					'&:hover': {
						backgroundColor: alpha(theme.palette.link.light, 0.1),
					},
				}}
			>
				<Badge badgeContent={basket.length} color="secondary">
					<ShoppingCart />
				</Badge>
			</IconButton>
		</Tooltip>
	);

	// For mobile, just return the button with no popover
	if (isMobile) return basketButton;

	return (
		<Box>
			{basketButton}
			<Popover
				open={!!anchorEl}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				disableScrollLock={true}
				TransitionProps={{ timeout: 0 }}
				sx={{ zIndex: theme.zIndex.modal + 1 }}
				slotProps={{
					paper: {
						elevation: 4,
						sx: {
							overflow: 'visible',
							mt: 1.5,
							borderRadius: 2,
							boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
							maxWidth: 'calc(100% - 32px)',
							minWidth: 320,
							'&:before': {
								//speech bubble
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								backgroundColor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
								boxShadow: '0px -2px 5px rgba(0,0,0,0.1)',
							},
						},
					},
				}}
			>
				<BasketContent onClose={() => setAnchorEl(null)} isMobile={isMobile} />
			</Popover>
		</Box>
	);
};

export default Basket;
