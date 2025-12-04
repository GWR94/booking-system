import { useState, useRef, useEffect } from 'react';
import { Badge, Box, IconButton, Popover, Tooltip } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useBasket } from '@hooks';
import BasketContent from './BasketContent';
import { useTheme, alpha } from '@mui/material/styles';

interface BasketButtonProps {
	isMobile: boolean;
	onMobileBasketClick: () => void;
}

const BasketButton = ({
	isMobile = false,
	onMobileBasketClick,
}: BasketButtonProps) => {
	const theme = useTheme();
	const { basket } = useBasket();
	const buttonRef = useRef<HTMLDivElement>(null);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const handleBasketButtonClick = (event: React.MouseEvent<HTMLElement>) => {
		if (isMobile) {
			onMobileBasketClick();
		} else {
			setAnchorEl(event.currentTarget);
		}
	};

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

	useEffect(() => {
		setAnchorEl(null);
	}, [location.pathname]);

	// For mobile, just return the button with no popover
	if (isMobile) return basketButton;

	return (
		<Box>
			<Box ref={buttonRef}>{basketButton}</Box>
			<Popover
				open={!!anchorEl}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				container={
					buttonRef.current
						? (buttonRef.current.parentNode as HTMLElement)
						: null
				}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
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
				<BasketContent onClose={() => setAnchorEl(null)} />
			</Popover>
		</Box>
	);
};

export default BasketButton;
