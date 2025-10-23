// useSession.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';

// Define a type for the session state
type SessionState = {
	selectedDate: string; // Store as string for query key stability
	selectedSession: number;
	selectedBay: number;
};

// Initial session state
const defaultSession: SessionState = {
	selectedDate: dayjs().format('YYYY-MM-DD'),
	selectedSession: 1,
	selectedBay: 5,
};

export const useSession = () => {
	const queryClient = useQueryClient();

	// Get current session state
	const { data: session = defaultSession } = useQuery({
		queryKey: ['session'],
		queryFn: () => defaultSession,
		staleTime: Infinity, // Never refetch automatically
		initialData: defaultSession,
	});

	// Create a mutation to update session
	const updateSession = useMutation({
		mutationFn: (newSession: Partial<SessionState>) => {
			return Promise.resolve({ ...session, ...newSession });
		},
		onSuccess: (updatedSession) => {
			// Update session in cache
			queryClient.setQueryData(['session'], updatedSession);

			// If date changed, invalidate slots
			queryClient.removeQueries({ queryKey: ['slots'] });
			queryClient.resetQueries({ queryKey: ['slots'] });
		},
	});

	// Convenience methods for updating specific fields
	const setSelectedDate = (date: Dayjs) => {
		const dateStr = date.format('YYYY-MM-DD');
		updateSession.mutate({ selectedDate: dateStr });
	};

	const setSelectedSession = (session: number) => {
		updateSession.mutate({ selectedSession: session });
	};

	const setSelectedBay = (bay: number) => {
		updateSession.mutate({ selectedBay: bay });
	};

	return {
		selectedDate: dayjs(session.selectedDate),
		selectedSession: session.selectedSession,
		selectedBay: session.selectedBay,
		setSelectedDate,
		setSelectedSession,
		setSelectedBay,
	};
};
