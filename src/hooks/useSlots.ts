import { useQuery } from '@tanstack/react-query';
import { fetchSlots } from '@api';
import { getGroupedTimeSlots } from '@utils';
import { useSession, useBasket } from '@hooks';
import { TimeSlot } from '@components/booking';

export function useSlots() {
	const { selectedDate, selectedSession, selectedBay } = useSession();
	const { basket } = useBasket();

	const {
		data: slots = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ['slots', selectedDate],
		queryFn: () => fetchSlots(selectedDate),
		refetchOnMount: 'always',
		refetchOnWindowFocus: false,
		refetchInterval: 0,
		staleTime: 0,
	});

	const groupedTimeSlots = getGroupedTimeSlots(
		slots as TimeSlot[],
		selectedSession,
		selectedBay,
		basket,
	);

	return {
		slots,
		groupedTimeSlots,
		isLoading,
		error,
		currentDate: selectedDate,
	};
}
