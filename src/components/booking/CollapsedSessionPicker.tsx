import {
	KeyboardArrowUp,
	CalendarMonth,
	Timer,
	GolfCourse,
} from '@mui/icons-material';
import { Box, IconButton, Paper, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { useSession } from '../../hooks/useSession';

interface CollapsedSessionProps {
	isExpanded: boolean;
	setIsExpanded: (isExpanded: boolean) => void;
}

const CollapsedSessionPicker = ({
	isExpanded,
	setIsExpanded,
}: CollapsedSessionProps) => {
	const theme = useTheme();
	const { selectedDate, selectedSession, selectedBay } = useSession();

	return (
		<>
			<Box
				sx={{
					position: 'absolute',
					bottom: -10,
					left: '50%',
					transform: 'translateX(-50%)',
					zIndex: 10,
				}}
			>
				<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
					<IconButton
						onClick={() => setIsExpanded(!isExpanded)}
						sx={{
							backgroundColor: theme.palette.primary.main,
							color: 'white',
							boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
							width: 20,
							height: 20,
							'&:hover': {
								backgroundColor: theme.palette.primary.dark,
							},
							transition: 'all 0.3s ease',
							transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
						}}
						aria-label={
							isExpanded ? 'Hide filter options' : 'Show filter options'
						}
					>
						<KeyboardArrowUp fontSize="small" />
					</IconButton>
				</motion.div>
			</Box>

			{/* Static Collapsed Preview */}
			{!isExpanded && (
				<Paper
					elevation={3}
					sx={{
						p: 2,
						display: 'flex',
						justifyContent: 'space-around',
						borderBottom: `2px solid ${theme.palette.primary.main}`,
						borderBottomLeftRadius: 0,
						borderBottomRightRadius: 0,
						maxWidth: 600,
						pb: 3,
						mx: { xs: 2, sm: 'auto' },
						alignItems: 'center',
						flexWrap: 'wrap',
						gap: 2,
						cursor: 'pointer',
					}}
					onClick={() => setIsExpanded(true)}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							width: { xs: '100%', md: 'auto' },
							justifyContent: 'center',
						}}
					>
						<CalendarMonth sx={{ color: theme.palette.primary.main, mr: 1 }} />
						<Typography sx={{ color: theme.palette.text.secondary }}>
							{selectedDate.format('ddd MMMM Do YYYY')}
						</Typography>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Timer sx={{ color: theme.palette.secondary.main, mr: 1 }} />
						<Typography sx={{ color: theme.palette.text.secondary }}>
							{selectedSession} {selectedSession === 1 ? 'Hour' : 'Hours'}{' '}
							Session
						</Typography>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<GolfCourse sx={{ color: theme.palette.accent.main, mr: 1 }} />
						<Typography sx={{ color: theme.palette.text.secondary }}>
							{selectedBay === 5 ? 'Any Bay' : `Bay ${selectedBay}`}
						</Typography>
					</Box>
				</Paper>
			)}
		</>
	);
};

export default CollapsedSessionPicker;
