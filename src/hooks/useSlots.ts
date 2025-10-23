// useSlots.ts
import { useQuery } from '@tanstack/react-query';
import { fetchSlots } from '../api/basket';
import { getGroupedTimeSlots } from '../utils/slots';
import { useSession } from './useSession';
import { useBasket } from './useBasket';
import { TimeSlot } from '../components/interfaces/SlotContext.i';

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

	// Calculate grouped slots
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
