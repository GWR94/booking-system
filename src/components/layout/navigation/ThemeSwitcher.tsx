import { useAppTheme } from '@context';
import { Brush } from '@mui/icons-material';
import {
	IconButton,
	Typography,
	MenuItem,
	Box,
	ListItemText,
	useTheme,
	alpha,
	Menu,
} from '@mui/material';
import { themes } from '@styles/themes';
import { useState } from 'react';

type ThemeSwitcherProps = {
	isMobile: boolean;
	onMobileClick?: () => void;
};

const ThemeSwitcher = ({ isMobile, onMobileClick }: ThemeSwitcherProps) => {
	const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
	const { currentThemeId, setThemeId } = useAppTheme();
	const theme = useTheme();

	const isThemeMenuOpen = Boolean(themeAnchorEl);

	const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		if (isMobile && onMobileClick) {
			onMobileClick();
		} else {
			setThemeAnchorEl(event.currentTarget);
		}
	};

	const handleThemeMenuClose = () => {
		setThemeAnchorEl(null);
	};

	const handleThemeSelect = (themeId: string) => {
		setThemeId(themeId);
		handleThemeMenuClose();
	};

	return (
		<>
			<IconButton
				onClick={handleThemeMenuOpen}
				sx={{
					borderRadius: 1.5,
					mr: 1,
					color: theme.palette.link.light,
					transition: 'all 0.2s ease',
					'&:hover': {
						backgroundColor: alpha(theme.palette.link.light, 0.1),
					},
				}}
			>
				<Brush sx={{ fontSize: isMobile ? 20 : 24 }} />
			</IconButton>
			<Menu
				anchorEl={themeAnchorEl}
				open={isThemeMenuOpen}
				onClose={handleThemeMenuClose}
				disableScrollLock
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				slotProps={{
					paper: {
						elevation: 4,
						sx: {
							overflow: 'visible',
							mt: 1.5,
							borderRadius: 2,
							minWidth: 200,
							boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
							border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
							'&:before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								backgroundColor: theme.palette.background.paper,
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
								borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
								borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
							},
						},
					},
				}}
			>
				<Typography variant="h6" textAlign="center">
					Themes
				</Typography>
				{themes.map((t) => (
					<MenuItem
						key={t.id}
						onClick={() => handleThemeSelect(t.id)}
						selected={t.id === currentThemeId}
					>
						<Box sx={{ display: 'flex', mr: 3 }}>
							{[
								t.palette.primary?.main,
								t.palette.secondary?.main,
								t.palette.accent?.main,
							].map((color, index) => (
								<Box
									key={index}
									sx={{
										mr: -1,
										width: 20,
										height: 20,
										borderRadius: '50%',
										backgroundColor: color,
										border: `2px solid ${theme.palette.background.paper}`,
										boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
										zIndex: 5 - index,
										transition: 'transform 0.2s',
										'&:hover': {
											transform: 'scale(1.2) translateY(-2px)',
											zIndex: 10,
										},
									}}
								/>
							))}
						</Box>
						<ListItemText primary={t.name} />
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default ThemeSwitcher;
