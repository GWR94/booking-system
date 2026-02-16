'use client';

import { Box, SxProps } from '@mui/material';
import { useRouter } from 'next/navigation';

interface LogoProps {
	logoOnly?: boolean;
	dark?: boolean;
	sx?: SxProps;
}

const Logo = (
	{ logoOnly, dark, sx }: LogoProps = { logoOnly: false, dark: false },
) => {
	const router = useRouter();
	return (
		<Box
			onClick={() => router.push('/')}
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
				width={logoOnly ? 104 : 161}
				height={logoOnly ? 100 : 50}
				style={{ height: '100%', width: 'auto' }}
			/>
		</Box>
	);
};

export default Logo;
