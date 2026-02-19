'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchSlots } from '@api';
import { getGroupedTimeSlots } from '@utils';
import { useSession, useBasket } from '@hooks';
import { TimeSlot } from '@features/booking/components';

export const useSlots = () => {
	const { selectedDate, selectedSession, selectedBay } = useSession();
	const { basket } = useBasket();

	const dateKey = selectedDate.format('YYYY-MM-DD');

	const {
		data: slots = [],
		isLoading,
		isFetching,
		error,
	} = useQuery({
		queryKey: ['slots', dateKey],
		queryFn: () => fetchSlots(selectedDate),
		staleTime: 60 * 1000, // 1 min – avoid refetch storm; new date = new key = fresh fetch
		refetchOnWindowFocus: false,
	});

	const groupedTimeSlots = getGroupedTimeSlots(
		slots as TimeSlot[],
		selectedSession,
		selectedBay,
		basket,
	);

	// Show loading when no data yet (isLoading) or when refetching after date change (isFetching)
	const isSlotsLoading = isLoading || isFetching;

	return {
		slots,
		groupedTimeSlots,
		isLoading: isSlotsLoading,
		error,
		currentDate: selectedDate,
	};
};
