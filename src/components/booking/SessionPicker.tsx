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
import { GolfCourse, KeyboardArrowUp } from '@mui/icons-material';
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
				zIndex: 2,
			}}
		>
			<motion.div
				layout
				transition={{ duration: 0.3, ease: 'easeIn' }}
				style={{ overflow: 'visible' }}
			>
				<Box sx={{ pb: 3 }}>
					<Paper
						elevation={0}
						sx={{
							maxWidth: 800,
							mx: 'auto',
							background: 'rgba(255, 255, 255, 0.8)',
							backdropFilter: 'blur(12px)',
							border: `1px solid rgba(255, 255, 255, 0.1)`,
							borderRadius: 4,
							p: 3,
							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
							transition: 'all 0.3s ease',
						}}
					>
						<AnimatePresence mode="wait">
							{isExpanded ? (
								<motion.div
									key="expanded"
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
								>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											mb: 3,
											borderBottom: 1,
											borderColor: 'divider',
											pb: 2,
										}}
									>
										<Box
											sx={{
												p: 1,
												borderRadius: 2,
												mr: 2,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<GolfCourse color="primary" fontSize="medium" />
										</Box>
										<Box>
											<Typography
												variant="h6"
												sx={{
													fontWeight: 700,
													lineHeight: 1.2,
												}}
											>
												Find Available Sessions
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Customize your search below
											</Typography>
										</Box>
									</Box>

									<Grid container spacing={3}>
										<Grid size={{ xs: 12, md: 6 }}>
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
														borderRadius: 2,
														bgcolor: 'background.paper',
													},
												}}
												slotProps={{
													textField: {
														size: 'small',
														fullWidth: true,
													},
												}}
											/>
										</Grid>

										<Grid size={{ xs: 6, md: 3 }}>
											<FormControl
												fullWidth
												// variant="filled" // Used filled or outlined based on preference, standardizing on outlined for cleanliness
											>
												<InputLabel id="session-length-label">
													Duration
												</InputLabel>
												<Select
													labelId="session-length-label"
													id="session-length"
													value={selectedSession}
													label="Duration"
													size="small"
													onChange={(e) =>
														setSelectedSession(e.target.value as SessionTimes)
													}
													sx={{
														borderRadius: 2,
														bgcolor: 'background.paper',
													}}
													MenuProps={{ disableScrollLock: true }}
												>
													<MenuItem value={1}>1 Hour</MenuItem>
													<MenuItem value={2}>2 Hours</MenuItem>
													<MenuItem value={3}>3 Hours</MenuItem>
												</Select>
											</FormControl>
										</Grid>

										<Grid size={{ xs: 6, md: 3 }}>
											<FormControl fullWidth>
												<InputLabel id="bay-selection-label">Bay</InputLabel>
												<Select
													labelId="bay-selection-label"
													id="bay-selection"
													value={selectedBay}
													label="Bay"
													size="small"
													onChange={(e) =>
														setSelectedBay(e.target.value as Bays)
													}
													sx={{
														borderRadius: 2,
														bgcolor: 'background.paper',
													}}
													MenuProps={{ disableScrollLock: true }}
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
					bottom: 0,
					left: '50%',
					transform: 'translate(-50%, 50%)',
					zIndex: 10,
				}}
			>
				<IconButton
					onClick={() => setIsExpanded(!isExpanded)}
					size="small"
					sx={{
						backgroundColor: 'background.paper',
						border: '1px solid',
						borderColor: 'divider',
						color: 'text.primary',
						boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
						'&:hover': {
							backgroundColor: 'action.hover',
							transform: 'scale(1.1)',
						},
						transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
					}}
					aria-label={
						isExpanded ? 'Hide filter options' : 'Show filter options'
					}
				>
					<KeyboardArrowUp
						sx={{
							transition: 'transform 0.3s ease',
							transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
						}}
					/>
				</IconButton>
			</Box>
		</Box>
	);
};

export default SessionPicker;
