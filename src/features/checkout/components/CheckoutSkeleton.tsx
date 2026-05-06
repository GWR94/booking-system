'use client';

import {
	Box,
	Card,
	CardContent,
	Divider,
	Grid2 as Grid,
	Skeleton,
	Stack,
} from '@mui/material';

const CheckoutSkeleton = () => {
	return (
		<Box sx={{ mt: 2 }}>
			<Grid container spacing={4}>
				<Grid size={{ xs: 12, md: 8 }}>
					<Card
						elevation={0}
						sx={{
							mb: 3,
							borderRadius: 2,
							border: '1px solid',
							borderColor: 'divider',
						}}
					>
						<CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
							<Grid container spacing={2} alignItems="center">
								<Grid size={{ xs: 12, sm: 3 }}>
									<Stack direction="row" spacing={1.5} alignItems="center">
										<Skeleton
											variant="rounded"
											width={36}
											height={36}
											sx={{ borderRadius: 1.5 }}
										/>
										<Box sx={{ flex: 1 }}>
											<Skeleton variant="text" width="55%" />
											<Skeleton variant="text" width="70%" />
										</Box>
									</Stack>
								</Grid>
								<Grid size={{ xs: 6, sm: 4 }}>
									<Skeleton variant="text" width="70%" />
									<Skeleton variant="text" width="65%" />
								</Grid>
								<Grid size={{ xs: 6, sm: 4 }}>
									<Stack
										direction="row"
										justifyContent="space-between"
										alignItems="center"
									>
										<Skeleton variant="text" width="45%" />
										<Skeleton variant="text" width={70} height={36} />
									</Stack>
								</Grid>
								<Grid size={{ xs: 12, sm: 1 }} display="flex" justifyContent="flex-end">
									<Skeleton variant="circular" width={20} height={20} />
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					<Card
						variant="outlined"
						sx={{ borderRadius: 2, bgcolor: 'background.paper', mb: 4 }}
					>
						<CardContent sx={{ p: 3 }}>
							<Skeleton variant="text" width={160} height={36} sx={{ mb: 2 }} />
							<Skeleton
								variant="rounded"
								height={140}
								sx={{ mb: 3, borderRadius: 2 }}
							/>
							<Skeleton
								variant="rounded"
								height={280}
								sx={{ mb: 3, borderRadius: 1.5 }}
							/>
							<Skeleton variant="rounded" height={56} sx={{ borderRadius: 1 }} />
							<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
								<Skeleton variant="text" width={180} />
							</Box>
						</CardContent>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 4 }}>
					<Box sx={{ position: 'sticky', top: { xs: 16, md: 96 } }}>
						<Card
							variant="outlined"
							sx={{
								borderRadius: 2,
								bgcolor: 'background.paper',
								boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
								border: '1px solid',
								borderColor: 'divider',
							}}
						>
							<CardContent sx={{ p: 2.5 }}>
								<Skeleton variant="text" width={140} height={34} sx={{ mb: 2 }} />
								<Stack spacing={1.5}>
									<Box display="flex" justifyContent="space-between">
										<Skeleton variant="text" width="30%" />
										<Skeleton variant="text" width="25%" />
									</Box>
									<Box display="flex" justifyContent="space-between">
										<Skeleton variant="text" width="26%" />
										<Skeleton variant="text" width="20%" />
									</Box>
									<Divider sx={{ my: 1 }} />
									<Box display="flex" justifyContent="space-between" alignItems="center">
										<Skeleton variant="text" width="22%" height={30} />
										<Skeleton variant="text" width="32%" height={44} />
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default CheckoutSkeleton;
