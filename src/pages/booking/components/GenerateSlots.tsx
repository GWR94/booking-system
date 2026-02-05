import {
	Box,
	Typography,
	Grid2 as Grid,
	CircularProgress,
	Container,
	alpha,
	useTheme,
	Card,
} from '@mui/material';
import Slot from './Slot';
import dayjs from 'dayjs';
import { useSlots, useSession, useBasket } from '@hooks';
import { useEffect } from 'react';
import { useSnackbar } from '@context';
import CheckoutFooter from './CheckoutFooter';

const GenerateSlots = () => {
	const { groupedTimeSlots, isLoading } = useSlots();
	const { selectedBay } = useSession();
	const { basket, basketPrice, clearBasket } = useBasket();
	const theme = useTheme();
	const { setBottomOffset } = useSnackbar();

	useEffect(() => {
		if (basket.length > 0) {
			setBottomOffset(10); // Offset by 10 spacing units (~80px)
		} else {
			setBottomOffset(0);
		}
		return () => setBottomOffset(0);
	}, [basket.length, setBottomOffset]);

	const filteredSlots = Object.keys(groupedTimeSlots)
		.filter((key: string) => {
			const firstSlot = groupedTimeSlots[key][0];
			return dayjs(firstSlot.startTime).isAfter(dayjs());
		})
		.sort((a, b) => {
			const aTime = dayjs(groupedTimeSlots[a][0].startTime).valueOf();
			const bTime = dayjs(groupedTimeSlots[b][0].startTime).valueOf();
			return aTime - bTime;
		});

	return (
		<Container maxWidth="xl" sx={{ flexGrow: 1, p: 3 }}>
			<Grid
				container
				spacing={2}
				columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 10 }}
				justifyContent="center"
			>
				{isLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<CircularProgress />
					</Box>
				) : filteredSlots.length === 0 ? (
					<Box
						sx={{
							m: '10px auto',
						}}
					>
						<Typography variant="h6" align="center" gutterBottom>
							No available time slots
						</Typography>
						<Typography variant="h6" align="center" sx={{ fontSize: '1rem' }}>
							Please select a different date
						</Typography>
					</Box>
				) : (
					<>
						{selectedBay === 5 && (
							<Box
								sx={{
									width: '100%',
									display: 'flex',
									justifyContent: 'center',
									mb: 2,
								}}
							>
								<Card
									variant="outlined"
									sx={{
										display: 'inline-flex',
										px: { xs: 1.5, sm: 2 },
										py: 1,
										borderRadius: 2,
										bgcolor: alpha(theme.palette.background.paper, 0.7),
										backdropFilter: 'blur(10px)',
										border: '1px solid',
										borderColor: alpha(theme.palette.divider, 0.1),
									}}
								>
									<Box
										sx={{
											display: 'flex',
											flexWrap: 'wrap',
											alignItems: 'center',
											gap: { xs: 1, sm: 1.5 },
										}}
									>
										<Typography
											variant="caption"
											sx={{
												fontWeight: 700,
												color: 'text.secondary',
												whiteSpace: 'nowrap',
											}}
										>
											Availability:
										</Typography>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												gap: { xs: 1, sm: 1.5 },
												flexWrap: 'wrap',
											}}
										>
											{[
												{ label: 'Good', color: 'success.main' },
												{ label: 'Fair', color: 'warning.main' },
												{ label: 'Limited', color: 'error.main' },
											].map((item) => (
												<Box
													key={item.label}
													sx={{
														display: 'flex',
														alignItems: 'center',
														gap: 0.75,
														whiteSpace: 'nowrap',
													}}
												>
													<Box
														sx={{
															width: 10,
															height: 10,
															borderRadius: '50%',
															bgcolor: item.color,
															flexShrink: 0,
														}}
													/>
													<Typography
														variant="caption"
														sx={{ fontWeight: 600, lineHeight: 1 }}
													>
														{item.label}
													</Typography>
												</Box>
											))}
										</Box>
									</Box>
								</Card>
							</Box>
						)}
						{filteredSlots.map((timeRange: string, i: number) => (
							<Slot
								key={i}
								timeRange={timeRange}
								timeSlots={groupedTimeSlots}
							/>
						))}

						<CheckoutFooter />
					</>
				)}
			</Grid>
		</Container>
	);
};

export default GenerateSlots;
