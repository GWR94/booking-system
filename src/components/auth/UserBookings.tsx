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
import { Booking, StatusType } from '../interfaces/Booking.i';
import dayjs from 'dayjs';

type UserBookingsProps = {
	bookings: Booking[];
};

const UserBookings = ({ bookings }: UserBookingsProps) => {
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
							<TableCell>Booking Date</TableCell>
							<TableCell>Slots</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{bookings.map((booking) => {
							console.log(booking);
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
										<TableCell>
											{dayjs(booking.bookingTime).format('DD/MM/YYYY')}
										</TableCell>
										<TableCell>{booking.slots.length}</TableCell>
										<TableCell>{renderBookingStatus(booking.status)}</TableCell>
										<TableCell>
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
													sx={{ m: '0 auto' }}
												>
													Payment Details
												</Button>
											)}
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
