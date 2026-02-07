import { Button, useTheme } from '@mui/material';
import { Add, Check, Delete } from '@mui/icons-material';
import { GroupedSlot } from './types';

type UserSlotControlsProps = {
	slot: GroupedSlot;
	selectedBay: number;
	isInBasket: boolean;
	basketCount: number;
	availability?: 'good' | 'fair' | 'limited' | 'unavailable';
	handleSlotClick: () => void;
	handleRemoveOne: () => void;
};

const UserSlotControls = ({
	slot,
	selectedBay,
	isInBasket,
	basketCount,
	availability,
	handleSlotClick,
	handleRemoveOne,
}: UserSlotControlsProps) => {
	return (
		<>
			{selectedBay !== 5 && isInBasket ? (
				<Button
					fullWidth
					variant="outlined"
					color="error"
					onClick={(e) => {
						e.stopPropagation();
						handleRemoveOne();
					}}
					startIcon={<Delete />}
					sx={{
						borderRadius: 2,
						fontWeight: 700,
						py: 1,
					}}
				>
					Remove
				</Button>
			) : (
				<>
					{basketCount > 0 && selectedBay === 5 && (
						<Button
							variant="outlined"
							color="error"
							onClick={(e) => {
								e.stopPropagation();
								handleRemoveOne();
							}}
							sx={{
								minWidth: 0,
								borderRadius: 2,
								borderColor: 'error.main',
								py: 1,
								px: 2,
								height: '100%',
							}}
						>
							<Delete fontSize="small" />
						</Button>
					)}
					<Button
						fullWidth
						variant="contained"
						color="primary"
						onClick={handleSlotClick}
						startIcon={
							availability === 'unavailable' && basketCount > 0 ? (
								<Check />
							) : (
								<Add />
							)
						}
						disabled={availability === 'unavailable'}
						sx={{
							borderRadius: 2,
							fontWeight: 700,
							py: 1,
							flex: 1,
						}}
					>
						{availability === 'unavailable'
							? basketCount > 0
								? 'Added'
								: 'Unavailable'
							: `Add Bay ${slot.bayId}`}
					</Button>
				</>
			)}
		</>
	);
};

export default UserSlotControls;
