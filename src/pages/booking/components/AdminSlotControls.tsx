import { Button, Box, useTheme } from '@mui/material';
import { GroupedSlot } from './types';

type AdminSlotControlsProps = {
	hourlySlots: GroupedSlot[];
	onAdminSlotClick: (slot: GroupedSlot) => void;
};

const AdminSlotControls = ({
	hourlySlots,
	onAdminSlotClick,
}: AdminSlotControlsProps) => {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
			{[1, 2, 3, 4].map((bayId) => {
				const baySlot = hourlySlots.find((s) => s.bayId === bayId);
				const isBooked = !baySlot;

				return (
					<Button
						key={bayId}
						fullWidth
						variant={'outlined'}
						color="primary"
						disabled={isBooked}
						onClick={() => baySlot && onAdminSlotClick(baySlot)}
						sx={{
							minWidth: 0,
							p: 0,
							height: 36,
							borderRadius: 1,
							fontWeight: 700,
							borderColor: isBooked ? 'transparent' : 'divider',
							bgcolor: isBooked
								? theme.palette.action.disabledBackground
								: 'transparent',
							color: isBooked
								? theme.palette.text.disabled
								: theme.palette.primary.main,
						}}
					>
						{bayId}
					</Button>
				);
			})}
		</Box>
	);
};

export default AdminSlotControls;
