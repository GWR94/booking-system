'use client';

'use client';

import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Chip,
	Box,
	IconButton,
	Tooltip,
	TextField,
	InputAdornment,
	TablePagination,
	alpha,
	useTheme,
} from '@mui/material';
import {
	Visibility as ViewIcon,
	Search as SearchIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

type BookingsTableProps = {
	bookings: any[];
	totalBookings: number;
	page: number;
	rowsPerPage: number;
	search: string;
	onPageChange: (page: number) => void;
	onRowsPerPageChange: (rowsPerPage: number) => void;
	onSearchChange: (search: string) => void;
	onViewDetails: (booking: any) => void;
	getStatusColor: (
		status: string,
	) => 'success' | 'warning' | 'error' | 'default';
};

const BookingsTable = ({
	bookings,
	totalBookings,
	page,
	rowsPerPage,
	search,
	onPageChange,
	onRowsPerPageChange,
	onSearchChange,
	onViewDetails,
	getStatusColor,
}: BookingsTableProps) => {
	const theme = useTheme();

	return (
		<>
			<Paper
				elevation={0}
				sx={{
					borderRadius: 3,
					border: '1px solid',
					borderColor: 'divider',
					overflow: 'hidden',
				}}
			>
				<Box sx={{ p: 2 }}>
					<TextField
						fullWidth
						variant="outlined"
						placeholder="Search bookings by name, email, or ID..."
						size="small"
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						slotProps={{
							input: {
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon color="action" />
									</InputAdornment>
								),
							},
						}}
					/>
				</Box>
				<TableContainer>
					<Table sx={{ minWidth: 650 }} aria-label="bookings table">
						<TableHead
							sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}
						>
							<TableRow>
								<TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
								<TableCell sx={{ fontWeight: 600 }}>User</TableCell>
								<TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
								<TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
								<TableCell sx={{ fontWeight: 600 }}>Slots</TableCell>
								<TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
								<TableCell align="right" sx={{ fontWeight: 600 }}>
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{bookings?.map((booking: any) => (
								<TableRow
									key={booking.id}
									hover
									sx={{
										'&:last-child td, &:last-child th': { border: 0 },
										cursor: 'pointer',
									}}
									onClick={() => onViewDetails(booking)}
								>
									<TableCell
										component="th"
										scope="row"
										sx={{ fontWeight: 500 }}
									>
										{booking.id}
									</TableCell>
									<TableCell>
										<Box>
											<Typography variant="body2" fontWeight={600}>
												{booking.user?.name || 'Guest'}
											</Typography>
										</Box>
									</TableCell>
									<TableCell>
										{booking.slots?.[0]
											? dayjs(booking.slots[0].startTime).format('DD MMM YYYY')
											: dayjs(booking.bookingTime).format('DD MMM YYYY')}
									</TableCell>
									<TableCell>
										{booking.slots?.[0]
											? dayjs(booking.slots[0].startTime).format('HH:mm')
											: dayjs(booking.bookingTime).format('HH:mm')}
									</TableCell>
									<TableCell>
										<Chip
											label={`${booking.slots?.length || 0} Slots`}
											size="small"
											variant="outlined"
										/>
									</TableCell>
									<TableCell>
										<Chip
											label={booking.status}
											color={getStatusColor(booking.status)}
											size="small"
											sx={{ textTransform: 'capitalize', fontWeight: 600 }}
										/>
									</TableCell>
									<TableCell align="right">
										<Tooltip title="View Details">
											<IconButton
												size="small"
												onClick={(e) => {
													e.stopPropagation();
													onViewDetails(booking);
												}}
											>
												<ViewIcon fontSize="small" />
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={totalBookings}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={(e, newPage) => onPageChange(newPage)}
					onRowsPerPageChange={(e) => {
						onRowsPerPageChange(Number(e.target.value));
						onPageChange(0);
					}}
				/>
			</Paper>
		</>
	);
};

export default BookingsTable;
