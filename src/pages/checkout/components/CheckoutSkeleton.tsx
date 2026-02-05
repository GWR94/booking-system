import {
	Box,
	Card,
	CardContent,
	Grid2 as Grid,
	Skeleton,
	Stack,
} from '@mui/material';

const CheckoutSkeleton = () => {
	return (
		<Box sx={{ mt: 2 }}>
			{/* Items Loop Skeletons */}
			{[1, 2].map((item) => (
				<Card
					key={item}
					elevation={0}
					sx={{
						mb: 2,
						borderRadius: 2,
						border: '1px solid',
						borderColor: 'divider',
					}}
				>
					<CardContent>
						<Grid container spacing={2} alignItems="center">
							<Grid size={{ xs: 12, sm: 10 }}>
								<Grid container spacing={2}>
									<Grid size={{ xs: 6 }}>
										<Skeleton variant="text" width="40%" />
										<Skeleton variant="text" width="80%" height={30} />
									</Grid>
									<Grid size={{ xs: 6 }}>
										<Skeleton variant="text" width="40%" />
										<Skeleton variant="text" width="80%" height={30} />
									</Grid>
								</Grid>
							</Grid>
							<Grid size={{ xs: 12, sm: 2 }}>
								<Skeleton variant="text" width="100%" height={40} />
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			))}

			{/* Summary Card Skeleton */}
			<Card
				variant="outlined"
				sx={{ my: 4, borderRadius: 2, bgcolor: 'background.paper' }}
			>
				<CardContent sx={{ p: 3 }}>
					<Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
					<Stack spacing={2}>
						<Box display="flex" justifyContent="space-between">
							<Skeleton variant="text" width="20%" />
							<Skeleton variant="text" width="20%" />
						</Box>
						<Box display="flex" justifyContent="space-between">
							<Skeleton variant="text" width="20%" />
							<Skeleton variant="text" width="20%" />
						</Box>
						<Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
							<Skeleton variant="text" width="30%" height={40} />
							<Skeleton variant="text" width="30%" height={40} />
						</Box>
					</Stack>
				</CardContent>
			</Card>

			{/* Payment Details Skeleton */}
			<Card
				variant="outlined"
				sx={{ my: 4, borderRadius: 2, bgcolor: 'background.paper' }}
			>
				<CardContent sx={{ p: 3 }}>
					<Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
					<Skeleton
						variant="rectangular"
						height={150}
						sx={{ mb: 3, borderRadius: 1 }}
					/>
					<Skeleton
						variant="rectangular"
						height={56}
						sx={{ borderRadius: 1 }}
					/>
				</CardContent>
			</Card>
		</Box>
	);
};

export default CheckoutSkeleton;
