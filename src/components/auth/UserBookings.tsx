import {
	Box,
	Typography,
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Chip,
	Collapse,
	IconButton,
	Button,
	Link,
} from '@mui/material';
import {
	KeyboardArrowUp,
	KeyboardArrowDown,
	OpenInNew,
} from '@mui/icons-material';
import React, { useState } from 'react';
import { StatusType } from '../interfaces/Booking.i';
import dayjs from 'dayjs';
import axios from '../../utils/axiosConfig';
import { useAuth } from '../../hooks/useAuth';

const UserBookings = () => {
	const { user } = useAuth();
	const [expandedRow, setExpandedRow] = useState<string | null>(null);
	const renderBookingStatus = (status: StatusType) => {
		const statusColors: Partial<
			Record<StatusType, 'success' | 'warning' | 'error' | 'info'>
		> = {
			booked: 'success',
			confirmed: 'success',
			pending: 'warning',
			cancelled: 'error',
			unavailable: 'info',
		};
		return <Chip label={status} color={statusColors[status]} size="small" />;
	};

	const handleDeleteBooking = async (bookingId: number) => {
		const { data } = await axios.delete(`/api/booking/${bookingId}`);
	};

	if (!user || user.bookings.length === 0) return;

	return (
		<Box sx={{ mt: 4 }}>
			<Typography variant="h6" sx={{ mb: 2 }}>
				My Bookings
			</Typography>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell width="50px" />
							<TableCell align="center">Booking Date</TableCell>
							<TableCell align="center">Slots</TableCell>
							<TableCell align="center">Status</TableCell>
							<TableCell align="center">Actions</TableCell>
							<TableCell align="center" width="80px">
								Delete
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{user.bookings.map((booking) => {
							const isExpanded = expandedRow === booking.id.toString();
							return (
								<React.Fragment key={booking.id}>
									<TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
										<TableCell>
											<IconButton
												size="small"
												onClick={() =>
													setExpandedRow(
														isExpanded ? null : booking.id.toString(),
													)
												}
											>
												{isExpanded ? (
													<KeyboardArrowUp />
												) : (
													<KeyboardArrowDown />
												)}
											</IconButton>
										</TableCell>
										<TableCell align="center">
											{dayjs(booking.bookingTime).format('DD/MM/YYYY')}
										</TableCell>
										<TableCell align="center">{booking.slots.length}</TableCell>
										<TableCell align="center">
											{renderBookingStatus(booking.status)}
										</TableCell>
										<TableCell align="center">
											{booking.paymentId && (
												<Button
													variant="outlined"
													color="primary"
													endIcon={<OpenInNew />}
													component={Link}
													size="small"
													href={`https://dashboard.stripe.com/payments/${booking.paymentId}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													Payment Details
												</Button>
											)}
										</TableCell>
										<TableCell>
											<Button
												variant="outlined"
												size="small"
												color="primary"
												onClick={() => handleDeleteBooking(booking.id)}
											>
												Delete
											</Button>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell
											style={{ paddingBottom: 0, paddingTop: 0 }}
											colSpan={6}
										>
											<Collapse in={isExpanded} timeout="auto" unmountOnExit>
												<Box sx={{ margin: 2 }}>
													<Typography variant="h6" gutterBottom component="div">
														Slot Details
													</Typography>
													<Table size="small">
														<TableHead>
															<TableRow>
																<TableCell>Start Time</TableCell>
																<TableCell>End Time</TableCell>
																<TableCell>Bay</TableCell>
															</TableRow>
														</TableHead>
														<TableBody>
															{booking.slots.map((slot, index) => (
																<TableRow key={index}>
																	<TableCell>
																		{dayjs(slot.startTime).format('HH:mm')}
																	</TableCell>
																	<TableCell>
																		{dayjs(slot.endTime).format('HH:mm')}
																	</TableCell>
																	<TableCell>Bay {slot.bayId}</TableCell>
																</TableRow>
															))}
														</TableBody>
													</Table>
												</Box>
											</Collapse>
										</TableCell>
									</TableRow>
								</React.Fragment>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default UserBookings;
