import { Box, Typography, useTheme } from '@mui/material';
import { AnimateIn } from '@ui';
import { useNavigate } from 'react-router-dom';
import {
	StarOutline,
	SportsGolf,
	CardMembership,
	CalendarToday,
	LocationOn,
} from '@mui/icons-material';

const InformationChips = () => {
	const navigate = useNavigate();
	const theme = useTheme();

	const chips = [
		{
			icon: <SportsGolf sx={{ color: '#ffb300', fontSize: '1.25rem' }} />,
			label: '4 PREMIUM BAYS',
		},
		{
			icon: <LocationOn sx={{ color: '#ffb300', fontSize: '1.25rem' }} />,
			label: 'CENTRAL MAIDSTONE',
		},
		{
			icon: <StarOutline sx={{ color: '#ffb300', fontSize: '1.25rem' }} />,
			label: 'TRACKMAN TECHNOLOGY',
		},
		{
			icon: <CardMembership sx={{ color: '#ffb300', fontSize: '1.25rem' }} />,
			label: 'FLEXIBLE MEMBERSHIPS',
			onClick: () => navigate('/membership'),
		},
		{
			icon: <CalendarToday sx={{ color: '#ffb300', fontSize: '1.25rem' }} />,
			label: '24/7 ONLINE BOOKING',
			onClick: () => navigate('/book'),
		},
	];

	return (
		<AnimateIn type="fade-right" delay={1}>
			<Box
				sx={{
					my: 3,
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					flexWrap: 'wrap',
					gap: { xs: 1, md: 2 },
				}}
			>
				{chips.map((chip, index) => (
					<Box
						key={index}
						onClick={chip.onClick}
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							px: { xs: 1.5, md: 2 },
							py: 0.75,
							borderRadius: '50px',
							backgroundColor: 'rgba(255, 255, 255, 0.1)',
							backdropFilter: 'blur(12px)',
							border: '1px solid rgba(255, 255, 255, 0.2)',
							cursor: chip.onClick ? 'pointer' : 'default',
							isolation: 'isolate',
							transform: 'translateZ(0)',
							transition: 'all 0.2s ease',
							'&:hover': chip.onClick
								? {
										backgroundColor: 'rgba(255, 255, 255, 0.2)',
										borderColor: 'rgba(255, 255, 255, 0.3)',
										transform: 'translateY(-2px)',
									}
								: {},
						}}
					>
						{chip.icon}
						<Typography
							variant="caption"
							sx={{
								fontWeight: 600,
								color: '#ffffff',
								fontSize: { xs: '0.65rem', md: '0.75rem' },
								letterSpacing: '0.05em',
							}}
						>
							{chip.label}
						</Typography>
					</Box>
				))}
			</Box>
		</AnimateIn>
	);
};

export default InformationChips;
