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
			}}
		>
			<img src="GLF-logo.png" alt="GWR.GLF" width={50} />
		</Box>
	);
};

export default Logo;
