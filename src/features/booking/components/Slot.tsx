'use client';

import { useTheme, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useBasket, useAuth, useSession } from '@hooks';
import { useSnackbar } from '@context';
import { calculateSlotPrice } from '@utils';
import AdminBookingDialog from './AdminBookingDialog';
import { GroupedTimeSlots, GroupedSlot } from './types';
import DesktopSlot from './DesktopSlot';
import AdminSlotControls from './AdminSlotControls';
import UserSlotControls from './UserSlotControls';
import MobileSlot from './MobileSlot';

type SlotProps = {
	timeRange: string;
	timeSlots: GroupedTimeSlots;
	totalSlotCount?: number;
};

const Slot = ({ timeSlots, timeRange, totalSlotCount = 10 }: SlotProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { basket, addToBasket, removeFromBasket } = useBasket();
	const { showSnackbar } = useSnackbar();
	const { isAdmin, user } = useAuth();
	const { selectedBay } = useSession();

	const hourlySlots = timeSlots[timeRange];

	// Only show "in basket" when the basket contains this exact slot grouping: same start time
	// and same slotIds. Otherwise a 1-hour slot in the basket would show "in basket" for the
	// 2/3-hour row, or a slot from another time range would show as in basket here.
	const slotStartTime = timeRange.split('-')[0];
	const slotsInBasket = basket.filter((basketSlot) => {
		const startMatches =
			dayjs(basketSlot.startTime).format('HH:mm') === slotStartTime;
		const exactSlotMatch = hourlySlots.some(
			(slot) =>
				basketSlot.slotIds.length === slot.slotIds.length &&
				basketSlot.slotIds.every((id, i) => id === slot.slotIds[i]),
		);
		return startMatches && exactSlotMatch;
	});
	const basketCount = slotsInBasket.length;
	const isInBasket = basketCount > 0;
	const slotInBasket = slotsInBasket[0];

	const availableSlots = hourlySlots.filter(
		(slot) =>
			!basket.some((basketSlot) =>
				basketSlot.slotIds.some((id) => slot.slotIds.includes(id)),
			),
	);

	const availability =
		selectedBay === 5
			? availableSlots.length === 3 || availableSlots.length === 4
				? 'good'
				: availableSlots.length === 2
					? 'fair'
					: availableSlots.length === 1
						? 'limited'
						: 'unavailable'
			: undefined;

	const handleSlotClick = () => {
		if (isAdmin) {
			setAdminDialogOpen(true);
			return;
		}

		if (selectedBay === 5) {
			if (availableSlots.length > 0) {
				addToBasket(availableSlots[0]);
			}
		} else {
			if (slotInBasket) {
				removeFromBasket(slotInBasket, {
					onSuccess: () => {
						showSnackbar('Removed from basket', 'info');
					},
				});
			} else if (availableSlots.length > 0) {
				addToBasket(availableSlots[0]);
			}
		}
	};

	const handleRemoveOne = () => {
		if (slotsInBasket.length > 0) {
			removeFromBasket(slotsInBasket[slotsInBasket.length - 1], {
				onSuccess: () => {
					showSnackbar('Removed from basket', 'info');
				},
			});
		}
	};

	const displaySlot =
		availableSlots.length > 0 ? availableSlots[0] : hourlySlots[0];
	const slot = hourlySlots[0];

	const [adminDialogOpen, setAdminDialogOpen] = useState(false);
	const [selectedAdminSlot, setSelectedAdminSlot] =
		useState<GroupedSlot | null>(null);

	const handleAdminSlotClick = (slot: GroupedSlot) => {
		setSelectedAdminSlot(slot);
		setAdminDialogOpen(true);
	};

	const { originalPrice, discountedPrice, hasDiscount } = calculateSlotPrice(
		slot.startTime,
		user?.membershipTier,
		user?.membershipStatus === 'ACTIVE',
	);

	const borderColor = isInBasket ? theme.palette.primary.main : 'divider';

	if (availableSlots.length === 0 && !isInBasket) {
		return null;
	}

	return (
		<>
			{isMobile ? (
				<MobileSlot
					slot={displaySlot}
					basketCount={basketCount}
					availability={availability}
					price={{
						originalPrice,
						discountedPrice,
						hasDiscount,
					}}
					sx={{ borderColor }}
					handleSlotClick={handleSlotClick}
					handleRemoveOne={handleRemoveOne}
					totalSlotCount={totalSlotCount}
				/>
			) : isAdmin ? (
				<DesktopSlot
					slot={displaySlot}
					basketCount={basketCount}
					availability={availability}
					price={{
						originalPrice,
						discountedPrice,
						hasDiscount,
					}}
					sx={{ borderColor }}
				>
					<AdminSlotControls
						hourlySlots={hourlySlots}
						onAdminSlotClick={handleAdminSlotClick}
					/>
				</DesktopSlot>
			) : (
				<DesktopSlot
					slot={displaySlot}
					basketCount={basketCount}
					availability={availability}
					price={{
						originalPrice,
						discountedPrice,
						hasDiscount,
					}}
					sx={{ borderColor }}
				>
					<UserSlotControls
						slot={displaySlot}
						selectedBay={selectedBay}
						isInBasket={isInBasket}
						basketCount={basketCount}
						availability={availability}
						handleSlotClick={handleSlotClick}
						handleRemoveOne={handleRemoveOne}
					/>
				</DesktopSlot>
			)}
			{selectedAdminSlot && (
				<AdminBookingDialog
					open={adminDialogOpen}
					onClose={() => {
						setAdminDialogOpen(false);
						setSelectedAdminSlot(null);
					}}
					slot={selectedAdminSlot}
					startTime={dayjs(selectedAdminSlot.startTime).format()}
					endTime={dayjs(selectedAdminSlot.endTime).format()}
				/>
			)}
		</>
	);
};

export default Slot;
