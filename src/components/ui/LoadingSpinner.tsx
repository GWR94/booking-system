import React from 'react';
import { CircularProgress, Box, Theme, SxProps } from '@mui/material';

interface LoadingSpinnerProps {
	color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
	size?: number;
	sx?: SxProps<Theme>;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	color = 'primary',
	size = 50,
	sx,
}) => {
	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				minHeight: '80px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				...sx,
			}}
		>
			<CircularProgress color={color} size={size} />
		</Box>
	);
};

export default LoadingSpinner;
