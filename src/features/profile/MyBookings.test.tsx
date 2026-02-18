import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MyBookings from './MyBookings';
import { ThemeProvider } from '@context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('./components', () => ({
	UserBookings: () => (
		<div data-testid="user-bookings">
			<span>My bookings list</span>
		</div>
	),
}));

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<ThemeProvider>
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	</ThemeProvider>
);

describe('MyBookings', () => {
	it('renders UserBookings component', () => {
		render(<MyBookings />, { wrapper });

		expect(screen.getByTestId('user-bookings')).toBeInTheDocument();
		expect(screen.getByText('My bookings list')).toBeInTheDocument();
	});
});
