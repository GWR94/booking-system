import {
	ManageAccounts,
	Person,
	Settings,
	Logout,
	Login,
	HowToReg,
} from '@mui/icons-material';
import {
	Box,
	Tooltip,
	IconButton,
	alpha,
	Menu,
	Typography,
	MenuItem,
	Divider,
	useTheme,
} from '@mui/material';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type DesktopAccountButtonProps = {
	isMobile: boolean;
};

const DesktopAccountButton = ({ isMobile }: DesktopAccountButtonProps) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
	const menuRef = useRef<HTMLElement>(null);
	const { isAuthenticated, user, logout } = useAuth();

	return (
		<>
			{!isMobile && (
				<Box sx={{ display: 'flex' }}>
					<Tooltip title="Account options" placement="bottom" arrow>
						<IconButton
							onClick={(e) => setAnchorElMenu(e.currentTarget)}
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
							<ManageAccounts sx={{ color: theme.palette.link.light }} />
						</IconButton>
					</Tooltip>
				</Box>
			)}

			<Box ref={menuRef}>
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
					slotProps={{
						paper: {
							elevation: 4,
							sx: {
								width: 200,
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
					container={
						menuRef.current ? (menuRef.current.parentNode as HTMLElement) : null
					}
				>
					{isAuthenticated && (
						<Box
							sx={{
								px: 2,
								py: 1.5,
								borderBottom: `1px solid ${theme.palette.divider}`,
							}}
						>
							<Typography variant="subtitle1" fontWeight={600}>
								{user?.name ?? 'User'}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{user?.email?.split('@')[0]}
							</Typography>
						</Box>
					)}

					{isAuthenticated && (
						<MenuItem
							onClick={() => {
								navigate('/profile');
								setAnchorElMenu(null);
							}}
							sx={{ py: 1.5 }}
						>
							<Person sx={{ mr: 1.5, fontSize: 20 }} />
							<Typography variant="body2">Profile</Typography>
						</MenuItem>
					)}

					{isAuthenticated && (
						<MenuItem
							onClick={() => {
								navigate('/settings');
								setAnchorElMenu(null);
							}}
							sx={{ py: 1.5 }}
						>
							<Settings sx={{ mr: 1.5, fontSize: 20 }} />
							<Typography variant="body2">Settings</Typography>
						</MenuItem>
					)}

					{isAuthenticated && <Divider />}

					<MenuItem
						onClick={() => {
							isAuthenticated ? logout() : navigate('/login');
							setAnchorElMenu(null);
						}}
						sx={{ py: 1.5 }}
					>
						{isAuthenticated ? (
							<>
								<Logout sx={{ mr: 1.5, fontSize: 20 }} />
								<Typography variant="body2">Logout</Typography>
							</>
						) : (
							<>
								<Login sx={{ mr: 1.5, fontSize: 20 }} />
								<Typography variant="body2">Login</Typography>
							</>
						)}
					</MenuItem>

					{!isAuthenticated && (
						<MenuItem
							onClick={() => {
								navigate('/register');
								setAnchorElMenu(null);
							}}
							sx={{ py: 1.5 }}
						>
							<HowToReg sx={{ mr: 1.5, fontSize: 20 }} />
							<Typography variant="body2">Register</Typography>
						</MenuItem>
					)}
				</Menu>
			</Box>
		</>
	);
};

export default DesktopAccountButton;
