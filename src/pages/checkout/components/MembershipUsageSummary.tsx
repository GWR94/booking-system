import {
	Card,
	CardContent,
	Typography,
	Box,
	Grid2 as Grid,
} from '@mui/material';

type MembershipUsageSummaryProps = {
	includedHours: number;
	usedHours: number;
	hoursToDeduct: number;
	remainingAfter: number;
};

const MembershipUsageSummary = ({
	includedHours,
	usedHours,
	hoursToDeduct,
	remainingAfter,
}: MembershipUsageSummaryProps) => {
	return (
		<Card
			elevation={0}
			sx={{
				my: 3,
				border: '1px solid',
				borderColor: 'primary.light',
				bgcolor: 'primary.50',
				borderRadius: 2,
			}}
		>
			<CardContent>
				<Typography
					variant="h6"
					gutterBottom
					color="primary.main"
					sx={{ fontWeight: 600, fontSize: '1rem' }}
				>
					<Box component="span" sx={{ mr: 1, verticalAlign: 'middle' }}>
						💎
					</Box>
					Membership Allowance
				</Typography>
				<Grid container spacing={2}>
					<Grid size={{ xs: 6 }}>
						<Typography variant="caption" color="text.secondary">
							Included
						</Typography>
						<Typography variant="body1" fontWeight="bold">
							{includedHours} hrs
						</Typography>
					</Grid>
					<Grid size={{ xs: 6 }}>
						<Typography variant="caption" color="text.secondary">
							Used
						</Typography>
						<Typography variant="body1">{usedHours} hrs</Typography>
					</Grid>
					<Grid size={{ xs: 6 }}>
						<Typography variant="caption" color="text.secondary">
							Using Now
						</Typography>
						<Typography variant="body1" color="primary.main" fontWeight="bold">
							{hoursToDeduct > 0 ? `-${hoursToDeduct} hrs` : '0 hrs'}
						</Typography>
					</Grid>
					<Grid size={{ xs: 6 }}>
						<Typography variant="caption" color="text.secondary">
							Remaining
						</Typography>
						<Typography
							variant="body1"
							color={remainingAfter === 0 ? 'error.main' : 'success.main'}
							fontWeight="bold"
						>
							{remainingAfter} hrs
						</Typography>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default MembershipUsageSummary;
