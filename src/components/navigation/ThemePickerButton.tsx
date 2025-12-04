// src/components/common/ThemePicker.tsx
import React, { useRef, useEffect } from 'react';
import {
	Box,
	FormControlLabel,
	IconButton,
	Menu,
	MenuItem,
	Switch,
	Tooltip,
	Typography,
	alpha,
	useTheme,
} from '@mui/material';
import { Brush, Check } from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeContext';
import { ThemePalette } from 'src/styles/themes';

interface ThemePickerProps {
	isMobile?: boolean;
	navbarHidden?: boolean;
}

const ThemePickerButton: React.FC<ThemePickerProps> = ({
	isMobile = false,
	navbarHidden = false,
}) => {
	const theme = useTheme();
	const {
		currentThemeId,
		changeTheme,
		availableThemes,
		darkMode,
		toggleDarkMode,
	} = useThemeContext();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleThemeChange = (themeId: string) => {
		changeTheme(themeId);
		handleClose();
	};

	// Close menu when navbar hides
	useEffect(() => {
		if (navbarHidden) {
			handleClose();
		}
	}, [navbarHidden]);

	return (
		<Box ref={menuRef}>
			<Tooltip title="Change theme" arrow>
				<IconButton
					onClick={handleClick}
					sx={{
						borderRadius: 1.5,
						p: isMobile ? 1 : 1.2,
						transition: 'all 0.2s ease',
						'&:hover': {
							backgroundColor: alpha(theme.palette.link.light, 0.1),
						},
					}}
				>
					<Brush sx={{ color: theme.palette.link.light }} />
				</IconButton>
			</Tooltip>

			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				disableScrollLock
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				slotProps={{
					paper: {
						elevation: 4,
						sx: {
							width: 240,
							overflow: 'visible',
							my: 1,
							pb: 1,
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
								backgroundColor: theme.palette.background.paper,
								transform: 'translateY(-50%) rotate(45deg)',
								boxShadow: '-3px -3px 5px -2px rgba(0,0,0,0.1)',
								zIndex: 0,
							},
						},
					},
				}}
				container={
					menuRef.current
						? (menuRef.current.parentNode as HTMLElement)
						: undefined
				}
			>
				<Box
					sx={{
						p: 2,
					}}
				>
					<Typography
						variant="subtitle2"
						color="text.secondary"
						fontWeight={500}
					>
						Select Theme
					</Typography>
				</Box>

				{availableThemes.map((themeOption: ThemePalette) => (
					<MenuItem
						key={themeOption.id}
						onClick={() => handleThemeChange(themeOption.id)}
						selected={currentThemeId === themeOption.id}
						sx={{
							py: 1.5,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Box
								sx={{
									display: 'flex',
									mr: 2,
								}}
							>
								<Box
									sx={{
										width: 24,
										height: 24,
										borderRadius: '50%',
										backgroundColor: themeOption.palette.primary?.main,
										mr: -1,
										border: '2px solid #fff',
										boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
									}}
								/>
								<Box
									sx={{
										width: 24,
										height: 24,
										mr: -1,
										borderRadius: '50%',
										backgroundColor: themeOption.palette.secondary?.main,
										border: '2px solid #fff',
										boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
									}}
								/>
								<Box
									sx={{
										width: 24,
										height: 24,
										mr: -1,
										borderRadius: '50%',
										backgroundColor: themeOption.palette.accent?.main,
										border: '2px solid #fff',
										boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
									}}
								/>
							</Box>
							<Typography variant="body2">{themeOption.name}</Typography>
						</Box>

						{currentThemeId === themeOption.id && (
							<Check fontSize="small" color="primary" />
						)}
					</MenuItem>
				))}
				{/* Dark Mode Toggle */}
				<Box sx={{ px: 2, py: 1.5 }}>
					<FormControlLabel
						control={
							<Switch
								checked={darkMode}
								onChange={toggleDarkMode}
								color="primary"
							/>
						}
						label={
							<Typography variant="body2" color="text.secondary">
								Dark Mode
							</Typography>
						}
					/>
				</Box>
			</Menu>
		</Box>
	);
};

export default ThemePickerButton;
