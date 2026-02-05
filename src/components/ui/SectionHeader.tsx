import { Box, Typography, useTheme, SxProps, Theme } from '@mui/material';
import { AnimateIn } from '@ui';

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
	description?: string;
	align?: 'left' | 'center' | 'right';
	color?: 'primary' | 'secondary' | 'white';
	sx?: SxProps<Theme>;
	noAnimation?: boolean;
}

const SectionHeader = ({
	title,
	subtitle,
	description,
	align = 'center',
	color = 'primary',
	sx,
	noAnimation = false,
}: SectionHeaderProps) => {
	const theme = useTheme();

	const getColor = (variant: 'primary' | 'secondary' | 'white') => {
		switch (variant) {
			case 'primary':
				return theme.palette.primary.main;
			case 'secondary':
				return theme.palette.secondary.main;
			case 'white':
				return theme.palette.common.white;
			default:
				return theme.palette.primary.main;
		}
	};

	const textColor = color === 'white' ? 'common.white' : 'text.primary';
	const subtitleColor =
		color === 'white' ? 'rgba(255,255,255,0.7)' : getColor(color);
	const descriptionColor =
		color === 'white' ? 'rgba(255,255,255,0.7)' : 'text.secondary';

	return (
		<Box sx={{ textAlign: align, mb: 6, ...sx }}>
			<AnimateIn type={noAnimation ? undefined : 'fade-down'}>
				{subtitle && (
					<Typography
						variant="overline"
						sx={{
							color: subtitleColor,
							fontWeight: 700,
							letterSpacing: 2,
							mb: 1,
							display: 'block',
						}}
					>
						{subtitle}
					</Typography>
				)}
				<Typography
					variant="h2"
					component="h2"
					sx={{
						fontWeight: 700,
						mb: description ? 2 : 0,
						color: textColor,
					}}
				>
					{title}
				</Typography>
				{description && (
					<Typography
						variant="h6"
						color={descriptionColor}
						sx={{
							maxWidth: align === 'center' ? 700 : 500,
							mx: align === 'center' ? 'auto' : 0,
							fontWeight: 400,
							lineHeight: 1.6,
						}}
					>
						{description}
					</Typography>
				)}
			</AnimateIn>
		</Box>
	);
};

export default SectionHeader;
