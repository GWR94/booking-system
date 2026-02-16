'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';

type SessionState = {
	selectedDate: string;
	selectedSession: number;
	selectedBay: number;
};

const defaultSession: SessionState = {
	selectedDate: dayjs().isAfter(dayjs().hour(21).startOf('hour'))
		? dayjs().add(1, 'day').format('YYYY-MM-DD')
		: dayjs().format('YYYY-MM-DD'),
	selectedSession: 1,
	selectedBay: 5, // all bays
};

export const useSession = () => {
	const queryClient = useQueryClient();

	const { data: session = defaultSession } = useQuery({
		queryKey: ['session'],
		queryFn: () => defaultSession,
		staleTime: Infinity,
		initialData: defaultSession,
	});

	const updateSession = useMutation({
		mutationFn: (newSession: Partial<SessionState>) => {
			return Promise.resolve({ ...session, ...newSession });
		},
		onSuccess: (updatedSession) => {
			queryClient.setQueryData(['session'], updatedSession);

			queryClient.removeQueries({ queryKey: ['slots'] });
			queryClient.resetQueries({ queryKey: ['slots'] });
		},
	});

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
