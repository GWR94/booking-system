import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid2 as Grid,
	Box,
	Typography,
	useTheme,
	Paper,
	IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers';
import {
	GolfCourse,
	KeyboardArrowUp,
	CalendarMonth,
	Timer,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { Bays, SessionTimes } from '../interfaces/SlotContext.i';
import { useSession } from '@hooks';
import { useState } from 'react';
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
			const formattedDate = dayjs(newDate.format('YYYY-MM-DD'));
			if (
				formattedDate.format('YYYY-MM-DD') !== selectedDate.format('YYYY-MM-DD')
			) {
				setSelectedDate(formattedDate);
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
			<motion.div
				layout
				transition={{ duration: 0.3, ease: 'easeIn' }}
				style={{ overflow: 'hidden' }}
			>
				<Box sx={{ pb: 2 }}>
					<Paper
						elevation={3}
						sx={{
							maxWidth: 600,
							mx: { xs: 2, sm: 'auto' },
							borderBottom: `2px solid ${theme.palette.primary.main}`,
							borderBottomLeftRadius: 0,
							borderBottomRightRadius: 0,
							p: 2,
							transition: 'padding 0.3s ease',
						}}
					>
						<AnimatePresence mode="wait">
							{isExpanded ? (
								<motion.div
									key="expanded"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
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
										Select your preferred date, duration, and bay to find
										available time slots for your golf simulator session.
									</Typography>

									<Grid container spacing={2}>
										<Grid size={{ xs: 12, sm: 6 }}>
											<DatePicker
												label="Select Date"
												value={selectedDate}
												format="dddd Do MMM 'YY' "
												shouldDisableDate={(date) =>
													date.day() === 0 ||
													date.add(1, 'day').isBefore(dayjs())
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
														size: 'small',
														id: 'select-date',
													},
												}}
											/>
										</Grid>

										<Grid size={{ xs: 6, sm: 3 }}>
											<FormControl
												sx={{ width: '100%' }}
												variant="outlined"
												size="small"
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

										<Grid size={{ xs: 6, sm: 3 }}>
											<FormControl
												sx={{ width: '100%' }}
												variant="outlined"
												size="small"
											>
												<InputLabel id="bay-selection-label">Bay</InputLabel>
												<Select
													labelId="bay-selection-label"
													id="bay-selection"
													value={selectedBay}
													label="Bay"
													onChange={(e) =>
														setSelectedBay(e.target.value as Bays)
													}
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
								</motion.div>
							) : (
								<CollapsedSessionPicker setIsExpanded={setIsExpanded} />
							)}
						</AnimatePresence>
					</Paper>
				</Box>
			</motion.div>

			<Box
				sx={{
					position: 'absolute',
					bottom: 8,
					left: '50%',
					transform: 'translate(-50%, 50%)',
					zIndex: 10,
				}}
			>
				<IconButton
					onClick={() => setIsExpanded(!isExpanded)}
					sx={{
						backgroundColor: theme.palette.primary.main,
						color: 'white',
						boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
						width: 20,
						borderBottomLeftRadius: isExpanded ? '50%' : 0,
						borderBottomRightRadius: isExpanded ? '50%' : 0,
						borderTopLeftRadius: isExpanded ? 0 : '50%',
						borderTopRightRadius: isExpanded ? 0 : '50%',
						height: 20,
						'&:hover': {
							backgroundColor: theme.palette.primary.dark,
						},
						transition: 'all 0.5s ease',
						transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
					}}
					aria-label={
						isExpanded ? 'Hide filter options' : 'Show filter options'
					}
				>
					<KeyboardArrowUp fontSize="small" />
				</IconButton>
			</Box>
		</Box>
	);
};

export default SessionPicker;
