import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
	const navigate = useNavigate();
	return (
		<Box
			onClick={() => navigate('/')}
			sx={{
				display: 'flex',
				alignItems: 'center',
				cursor: 'pointer',
				height: '100%',
			}}
		>
			<img src="GLF-logo.png" alt="GWR.GLF" style={{ height: '100%' }} />
		</Box>
	);
};

export default Logo;
