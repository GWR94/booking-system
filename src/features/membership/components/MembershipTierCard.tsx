import { Check, Star } from '@mui/icons-material';
import {
	alpha,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	useTheme,
} from '@mui/material';
import type { TierInfo } from '@/constants/memberships';

type MembershipTierCardProps = {
	tier: TierInfo;
	onSelect?: (tier: TierInfo) => void;
	buttonLabel?: string;
	disabled?: boolean;
	loading?: boolean;
	isCurrentActiveTier?: boolean;
};

const MembershipTierCard = ({
	tier,
	onSelect,
	buttonLabel,
	disabled = false,
	loading = false,
	isCurrentActiveTier = false,
}: MembershipTierCardProps) => {
	const theme = useTheme();

	return (
		<Card
			elevation={0}
			sx={{
				p: { xs: 2, md: 1, lg: 4 },
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				maxWidth: '364px',
				margin: '0 auto',
				borderRadius: 4,
				background: alpha(theme.palette.background.paper, 0.6),
				border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				overflow: 'hidden',
				'&:hover': {
					transform: 'translateY(-8px)',
					boxShadow: `0 12px 24px -10px ${alpha(theme.palette.primary.main, 0.3)}`,
					border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
				},
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: '4px',
					background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
					opacity: 0,
					transition: 'opacity 0.3s ease',
				},
				'&:hover::before': {
					opacity: 1,
				},
				...(tier.recommended && {
					background: alpha(theme.palette.background.paper, 0.8),
					boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
				}),
			}}
		>
			{tier.recommended && (
				<Chip
					label="Most Popular"
					color="primary"
					size="small"
					icon={<Star fontSize="small" sx={{ color: 'white !important' }} />}
					sx={{
						position: 'absolute',
						top: 16,
						right: 16,
						fontWeight: 700,
						background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
						color: 'white',
						border: 'none',
						boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
					}}
				/>
			)}
			<CardContent
				sx={{
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Typography
					variant="h5"
					component="h3"
					gutterBottom
					sx={{ fontWeight: 700 }}
				>
					{tier.title}
				</Typography>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'baseline',
						mb: 3,
						pb: 3,
						borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
					}}
				>
					<Typography
						variant="h3"
						component="span"
						color="primary"
						sx={{
							fontWeight: 900,
							background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
					>
						{tier.price}
					</Typography>
					<Typography
						variant="subtitle1"
						color="text.secondary"
						sx={{ ml: 1, fontWeight: 500 }}
					>
						{tier.period}
					</Typography>
				</Box>
				<List
					sx={{
						mb: 0,
						flexGrow: 1,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					{tier.features.map((feature) => (
						<ListItem key={feature} disableGutters sx={{ py: 0.5 }}>
							<ListItemIcon sx={{ minWidth: 32 }}>
								<Check color="secondary" fontSize="small" />
							</ListItemIcon>
							<ListItemText
								primary={feature}
								slotProps={{
									primary: {
										variant: 'body2',
									},
								}}
							/>
						</ListItem>
					))}
				</List>
			</CardContent>
			<Box sx={{ p: 2, pt: 2 }}>
				<Button
					variant={isCurrentActiveTier ? 'contained' : 'outlined'}
					fullWidth
					color="primary"
					size="large"
					disabled={disabled || loading}
					sx={{
						borderRadius: 3,
						py: 1.5,
						textTransform: 'none',
						fontSize: '1rem',
						fontWeight: 700,
						...(isCurrentActiveTier
							? {
									background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
									boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
									'&:hover': {
										background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
										boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.5)}`,
									},
								}
							: {
									borderWidth: 2,
									'&:hover': {
										borderWidth: 2,
										bgcolor: alpha(theme.palette.primary.main, 0.04),
									},
								}),
					}}
					onClick={() => onSelect?.(tier)}
				>
					{loading ? 'Loading...' : (buttonLabel ?? `Choose ${tier.title}`)}
				</Button>
			</Box>
		</Card>
	);
};

export default MembershipTierCard;
