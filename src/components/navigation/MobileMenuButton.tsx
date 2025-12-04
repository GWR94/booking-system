import { Close, Menu } from '@mui/icons-material';
import { Box, IconButton, alpha, useTheme } from '@mui/material';

type MobileMenuButtonProps = {
	setMenuContent: (content: 'nav' | 'basket') => void;
	setIsMenuOpen: (isOpen: boolean) => void;
	isMenuOpen: boolean;
};

const MobileMenuButton = ({
	setMenuContent,
	setIsMenuOpen,
	isMenuOpen,
}: MobileMenuButtonProps) => {
	const theme = useTheme();

	return (
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
	);
};

export default MobileMenuButton;
