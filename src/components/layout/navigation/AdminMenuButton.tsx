import { AdminPanelSettings } from '@mui/icons-material';
import {
	Box,
	Tooltip,
	IconButton,
	alpha,
	Menu,
	Typography,
	MenuItem,
	useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_MENU_ITEMS } from './menuItems';

type AdminMenuButtonProps = {
	isMobile?: boolean;
	onMobileClick?: () => void;
};

const AdminMenuButton = ({ isMobile, onMobileClick }: AdminMenuButtonProps) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);

	// Close menu on scroll
	useEffect(() => {
		const handleScroll = () => {
			if (anchorElMenu) {
				setAnchorElMenu(null);
			}
		};

		if (anchorElMenu) {
			window.addEventListener('scroll', handleScroll, { passive: true });
			document.addEventListener('scroll', handleScroll, { passive: true });
		}

		return () => {
			window.removeEventListener('scroll', handleScroll);
			document.removeEventListener('scroll', handleScroll);
		};
	}, [anchorElMenu]);

	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		if (isMobile && onMobileClick) {
			onMobileClick();
		} else {
			setAnchorElMenu(e.currentTarget);
		}
	};

	return (
		<>
			<Box sx={{ display: 'flex' }}>
				<Tooltip title="Admin dashboard" placement="bottom" arrow>
					<IconButton
						onClick={handleClick}
						aria-label="Admin dashboard"
						sx={{
							borderRadius: 1.5,
							p: 1,
							ml: 0.5,
							transition: 'all 0.2s ease',
							'&:hover': {
								backgroundColor: alpha(theme.palette.link.light, 0.1),
							},
						}}
					>
						<AdminPanelSettings sx={{ color: theme.palette.link.light }} />
					</IconButton>
				</Tooltip>
			</Box>

			{!isMobile && (
				<Menu
					anchorEl={anchorElMenu}
					open={Boolean(anchorElMenu)}
					onClose={() => setAnchorElMenu(null)}
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
					slotProps={{
						paper: {
							elevation: 4,
							sx: {
								width: 180,
								overflow: 'visible',
								mt: 1.5,
								borderRadius: 2,
								boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
								'&:before': {
									content: '""',
									display: 'block',
									position: 'absolute',
									top: 0,
									right: 15,
									width: 12,
									height: 12,
									backgroundColor: 'inherit',
									transform: 'translateY(-50%) rotate(45deg)',
									boxShadow: '-3px -3px 5px -2px rgba(0,0,0,0.1)',
									zIndex: 0,
								},
							},
						},
					}}
				>
					<Box sx={{ px: 2, py: 1 }}>
						<Typography
							variant="caption"
							sx={{
								textTransform: 'uppercase',
								fontWeight: 700,
								color: 'primary.main',
								letterSpacing: 1,
							}}
						>
							Admin
						</Typography>
					</Box>
					{ADMIN_MENU_ITEMS.map((item) => (
						<MenuItem
							key={item.path}
							onClick={() => {
								navigate(item.path);
								setAnchorElMenu(null);
							}}
							sx={{ py: 1.5 }}
						>
							<item.Icon sx={{ mr: 1.5, fontSize: 20 }} />
							<Typography variant="body2">{item.label}</Typography>
						</MenuItem>
					))}
				</Menu>
			)}
		</>
	);
};

export default AdminMenuButton;
