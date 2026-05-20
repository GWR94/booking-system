import { Facebook, Instagram, X } from '@mui/icons-material';
import {
	Box,
	Button,
	IconButton,
	Stack,
	Typography,
	useTheme,
} from '@mui/material';
import COMPANY_INFO from '@/constants/company';

const socialLinks = [
	{
		label: 'Facebook',
		href: COMPANY_INFO.social.facebook,
		icon: <Facebook />,
	},
	{
		label: 'Instagram',
		href: COMPANY_INFO.social.instagram,
		icon: <Instagram />,
	},
	{
		label: 'X',
		href: COMPANY_INFO.social.twitter,
		icon: <X />,
		ariaLabel: 'X (Formerly Twitter)',
	},
] as const;

type SocialMediaIconsProps = {
	/** Icon-only row (e.g. footer) or heading + labelled buttons (e.g. about page) */
	layout?: 'icons' | 'block';
	/** Styling for icon layout only */
	tone?: 'footer' | 'light';
	justifyContent?: 'center' | 'flex-start';
};

const SocialMediaIcons = ({
	layout = 'icons',
	tone = 'footer',
	justifyContent = 'center',
}: SocialMediaIconsProps) => {
	const theme = useTheme();

	if (layout === 'block') {
		return (
			<Box>
				<Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
					Follow us online
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
					Bay offers, society nights, leaderboard updates, and new virtual
					courses.
				</Typography>
				<Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
					{socialLinks.map(({ label, href, icon, ...rest }) => (
						<Button
							key={label}
							component="a"
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							variant="outlined"
							color="secondary"
							size="small"
							startIcon={icon}
							aria-label={'ariaLabel' in rest ? rest.ariaLabel : label}
							sx={{ borderRadius: 2, textTransform: 'none' }}
						>
							{label}
						</Button>
					))}
				</Stack>
			</Box>
		);
	}

	const isFooter = tone === 'footer';
	const iconColor = isFooter
		? theme.palette.accent.main
		: theme.palette.secondary.main;
	const hoverBg = isFooter
		? theme.palette.primary.dark
		: theme.palette.action.hover;

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent,
			}}
		>
			{socialLinks.map(({ label, href, icon, ...rest }) => (
				<IconButton
					key={label}
					aria-label={'ariaLabel' in rest ? rest.ariaLabel : label}
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					sx={{
						color: iconColor,
						'&:hover': {
							backgroundColor: hoverBg,
						},
					}}
				>
					{icon}
				</IconButton>
			))}
		</Box>
	);
};

export default SocialMediaIcons;
