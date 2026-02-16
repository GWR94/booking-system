'use client';

import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid2 as Grid,
	Box,
	Card,
	CardContent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useSession } from '@hooks';
import { Bays, SessionTimes } from './types';

const SessionPicker = () => {
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
		<Box sx={{ width: '100%', position: 'relative', zIndex: 2 }}>
			<Card
				elevation={0}
				sx={{
					maxWidth: 800,
					mx: 'auto',
					borderRadius: 3,
					bgcolor: 'background.paper',
					boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
					border: '1px solid',
					borderColor: 'divider',
				}}
			>
				<CardContent sx={{ p: 3 }}>
					<Grid container spacing={3} alignItems="center">
						<Grid size={{ xs: 12, md: 6 }}>
							<DatePicker
								label="Select Date"
								value={selectedDate}
								format="dddd Do MMM 'YY"
								shouldDisableDate={(date) =>
									date.day() === 0 || date.add(1, 'day').isBefore(dayjs())
								}
								onChange={handleDateChange}
								sx={{ width: '100%' }}
								slotProps={{
									textField: {
										fullWidth: true,
									},
								}}
							/>
						</Grid>

						<Grid size={{ xs: 6, md: 3 }}>
							<FormControl fullWidth>
								<InputLabel id="session-length-label">Duration</InputLabel>
								<Select
									labelId="session-length-label"
									id="session-length"
									value={selectedSession}
									label="Duration"
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
							<FormControl fullWidth>
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
				</CardContent>
			</Card>
		</Box>
	);
};

export default SessionPicker;
