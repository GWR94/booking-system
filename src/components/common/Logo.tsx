import { GolfCourse } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				cursor: 'pointer',
				mr: { xs: 0, md: 3 },
				flexGrow: { xs: 1, md: 0 },
				justifyContent: { xs: 'center', md: 'flex-start' },
			}}
			onClick={() => navigate('/')}
		>
			<GolfCourse
				sx={{
					mr: 1.5,
					fontSize: { xs: 26, md: 30 },
					color: theme.palette.secondary.main,
				}}
			/>
			<Typography
				variant="h6"
				noWrap
				sx={{
					fontWeight: 700,
					color: 'inherit',
					fontSize: { xs: '1.1rem', md: '1.3rem' },
					display: 'flex',
					alignItems: 'center',
				}}
			>
				GWR.GLF
			</Typography>
		</Box>
	);
};

export default Logo;
