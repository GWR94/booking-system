import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './AdminDashboard';
import { ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const theme = createTheme();

// Mock API
vi.mock('@api', () => ({
	getDashboardStats: vi.fn(),
}));

// Mock UI components
vi.mock('@ui', () => ({
	AnimateIn: ({ children }: any) => <div>{children}</div>,
	LoadingSpinner: () => <div>Loading...</div>,
	SectionHeader: ({ title }: any) => <h1>{title}</h1>,
}));

import { getDashboardStats } from '@api';

const mockStats = {
	totalUsers: 100,
	activeMembers: 50,
	totalBookings: 200,
	cancelledBookings: 10,
	bookingsToday: 5,
	membershipStats: {
		PAR: 20,
		BIRDIE: 15,
		HOLEINONE: 15,
		NONE: 50,
	},
};

describe('AdminDashboard', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
			},
		});
		vi.clearAllMocks();
	});

	const renderDashboard = () => {
		return render(
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<Dashboard />
				</ThemeProvider>
			</QueryClientProvider>,
		);
	};

	it('should render stats cards correctly', async () => {
		vi.mocked(getDashboardStats).mockResolvedValue(mockStats);
		renderDashboard();

		expect(await screen.findByText('100')).toBeInTheDocument();
		expect(screen.getByText(/Total Users/i)).toBeInTheDocument();

		expect(screen.getAllByText('50').length).toBeGreaterThan(0);
	});

	it('should render today activity correctly', async () => {
		vi.mocked(getDashboardStats).mockResolvedValue(mockStats);
		renderDashboard();

		expect(await screen.findByText('5')).toBeInTheDocument();
		expect(screen.getByText(/Busy Day!/i)).toBeInTheDocument();
	});

	it('should render membership tiers correctly', async () => {
		vi.mocked(getDashboardStats).mockResolvedValue(mockStats);
		renderDashboard();

		expect(await screen.findByText('20')).toBeInTheDocument(); // PAR
		expect(screen.getByText(/BIRDIE/i)).toBeInTheDocument();

		const fifteenElements = screen.getAllByText('15');
		expect(fifteenElements.length).toBeGreaterThanOrEqual(1);
	});
});
