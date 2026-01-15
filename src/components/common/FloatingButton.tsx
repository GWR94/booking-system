import { SxProps, Box, Theme } from '@mui/material';

interface FloatingButtonProps {
	children: React.ReactNode;
	sx?: SxProps<Theme>;
}
const FloatingButton: React.FC<FloatingButtonProps> = ({
	sx,
	children,
}: FloatingButtonProps) => {
	return (
		<Box
			sx={{
				display: 'flex',
				cursor: 'pointer',
				p: 1,
				border: '1px solid #ccc',
				borderRadius: '5px',
				boxShadow: '0 0 10px #ccc',
				mb: 2,
				...sx,
				'&:hover': {
					backgroundColor: (theme) => theme.palette.grey[300],
					color: (theme) => theme.palette.grey[800],
				},
			}}
		>
			{children}
		</Box>
	);
};

export default FloatingButton;
