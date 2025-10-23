import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid2 as Grid,
	Box,
	Typography,
	useTheme,
	Container,
	IconButton,
	alpha,
	Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {
	CalendarMonth,
	Timer,
	GolfCourse,
	KeyboardArrowUp,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { SessionTimes } from '../../pages/Booking';
import { Bays } from '../interfaces/SlotContext.i';
import { useSession } from '../../hooks/useSession';
import { Fragment, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CollapsedSessionPicker from './CollapsedSessionPicker';

const SessionPicker = () => {
	const theme = useTheme();
	const [isExpanded, setIsExpanded] = useState(true);
	const {
		selectedDate,
		selectedSession,
		selectedBay,
		setSelectedBay,
		setSelectedDate,
		setSelectedSession,
	} = useSession();

	const handleDateChange = (newDate: Dayjs | null) => {
		if (newDate) {
			// Force a clean new date object
			const formattedDate = dayjs(newDate.format('YYYY-MM-DD'));

			// Only update if there's an actual change
			if (
				formattedDate.format('YYYY-MM-DD') !== selectedDate.format('YYYY-MM-DD')
			) {
				console.log('New date to set:', formattedDate.format('YYYY-MM-DD'));
				setSelectedDate(formattedDate);
			} else {
				console.log('Date unchanged, skipping update');
			}
		}
	};

	return (
		<Box
			sx={{
				width: '100%',
				position: 'relative',
				pt: 3,
			}}
		>
			<AnimatePresence initial={false}>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{
							type: 'spring',
							stiffness: 500,
							damping: 40,
							opacity: { duration: 0.2 },
						}}
						style={{
							overflow: 'hidden',
						}}
					>
						<Paper
							elevation={3}
							sx={{
								maxWidth: 600,
								mx: { xs: 2, sm: 'auto' },
								borderBottom: `2px solid ${theme.palette.primary.main}`,
								borderBottomLeftRadius: 0,
								borderBottomRightRadius: 0,

								p: { xs: 2, sm: 4 },
							}}
						>
							<Typography
								variant="h6"
								gutterBottom
								sx={{
									fontWeight: 600,
									color: theme.palette.primary.main,
									display: 'flex',
									alignItems: 'center',
									mb: { xs: 1, sm: 2 },
								}}
							>
								<GolfCourse
									sx={{ mr: 1, color: theme.palette.secondary.main }}
								/>
								Find Available Sessions
							</Typography>

							<Typography
								variant="body1"
								sx={{ mb: 3, color: 'text.secondary' }}
							>
								Select your preferred date, duration, and bay to find available
								time slots for your golf simulator session.
							</Typography>

							<Grid container spacing={2}>
								<Grid size={{ xs: 12, md: 6, sm: 12 }}>
									<DatePicker
										label="Select Date"
										value={selectedDate}
										format="dddd Do MMM 'YY"
										shouldDisableDate={(date) =>
											date.day() === 0 || date.add(1, 'day').isBefore(dayjs())
										}
										onChange={handleDateChange}
										sx={{
											width: '100%',
											'& .MuiOutlinedInput-root': {
												'&:hover fieldset': {
													borderColor: theme.palette.primary.main,
												},
											},
										}}
										slotProps={{
											textField: {
												size: 'medium',
											},
										}}
									/>
								</Grid>

								<Grid size={{ xs: 6, md: 3 }}>
									<FormControl
										sx={{ width: '100%' }}
										variant="outlined"
										size="medium"
									>
										<InputLabel id="session-length-label">
											Session Length
										</InputLabel>
										<Select
											labelId="session-length-label"
											id="session-length"
											value={selectedSession}
											label="Session Length"
											onChange={(e) =>
												setSelectedSession(e.target.value as SessionTimes)
											}
										>
											<MenuItem value={1}>1 Hour</MenuItem>
											<MenuItem value={2}>2 Hours</MenuItem>
											<MenuItem value={3}>3 Hours</MenuItem>
										</Select>
									</FormControl>
								</Grid>

								<Grid size={{ xs: 6, md: 3 }}>
									<FormControl
										sx={{ width: '100%' }}
										variant="outlined"
										size="medium"
									>
										<InputLabel id="bay-selection-label">Bay</InputLabel>
										<Select
											labelId="bay-selection-label"
											id="bay-selection"
											value={selectedBay}
											label="Bay"
											onChange={(e) => setSelectedBay(e.target.value as Bays)}
										>
											<MenuItem value={5}>Any Bay</MenuItem>
											<MenuItem value={1}>Bay 1</MenuItem>
											<MenuItem value={2}>Bay 2</MenuItem>
											<MenuItem value={3}>Bay 3</MenuItem>
											<MenuItem value={4}>Bay 4</MenuItem>
										</Select>
									</FormControl>
								</Grid>
							</Grid>
						</Paper>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Toggle Button */}
			<CollapsedSessionPicker
				isExpanded={isExpanded}
				setIsExpanded={setIsExpanded}
			/>
		</Box>
	);
};

export default SessionPicker;
