import { Box, SxProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
	logoOnly?: boolean;
	dark?: boolean;
	sx?: SxProps;
}

const Logo = (
	{ logoOnly, dark, sx }: LogoProps = { logoOnly: false, dark: false },
) => {
	const navigate = useNavigate();
	return (
		<Box
			onClick={() => navigate('/')}
			sx={{
				display: 'flex',
				alignItems: 'center',
				cursor: 'pointer',
				height: '100%',
				...sx,
			}}
		>
			<img
				src={
					logoOnly
						? dark
							? 'logo__dark.webp'
							: 'logo.webp'
						: dark
						? 'logo-tagline__dark.webp'
						: 'logo-tagline.webp'
				}
				alt="The Short Grass"
				style={{ height: '100%' }}
			/>
		</Box>
	);
};

export default Logo;
