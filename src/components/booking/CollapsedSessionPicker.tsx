import { CalendarMonth, Timer, GolfCourse } from '@mui/icons-material';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { useSession } from '@hooks';
import { motion } from 'framer-motion';

interface CollapsedSessionProps {
	setIsExpanded: (isExpanded: boolean) => void;
}

const CollapsedSessionPicker = ({ setIsExpanded }: CollapsedSessionProps) => {
	const theme = useTheme();
	const { selectedDate, selectedSession, selectedBay } = useSession();

	return (
		<motion.div
			key="collapsed"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-around',
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
						justifyContent: 'center',
					}}
				>
					<CalendarMonth sx={{ color: theme.palette.primary.main, mr: 1 }} />
					<Typography sx={{ color: theme.palette.text.secondary }}>
						{selectedDate.format("dddd MMM Do 'YY")}
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Timer sx={{ color: theme.palette.secondary.main, mr: 1 }} />
					<Typography sx={{ color: theme.palette.text.secondary }}>
						{selectedSession} {selectedSession === 1 ? 'Hour' : 'Hours'} Session
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<GolfCourse sx={{ color: theme.palette.accent.main, mr: 1 }} />
					<Typography sx={{ color: theme.palette.text.secondary }}>
						{selectedBay === 5 ? 'Any Bay' : `Bay ${selectedBay}`}
					</Typography>
				</Box>
			</Box>
		</motion.div>
	);
};

export default CollapsedSessionPicker;
