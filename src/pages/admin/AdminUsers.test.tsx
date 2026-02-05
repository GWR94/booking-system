import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Users from './AdminUsers';
import { ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from '@context';
import { getAllUsers } from '@api';

const theme = createTheme();

// Mock UI components
vi.mock('@ui', () => ({
	AnimateIn: ({ children }: any) => <div>{children}</div>,
	LoadingSpinner: () => <div>Loading...</div>,
	SectionHeader: ({ title }: any) => <h1>{title}</h1>,
}));

// Mock API
vi.mock('@api', () => ({
	getAllUsers: vi.fn(),
	updateUser: vi.fn(),
	deleteUser: vi.fn(),
}));

// Mock components
vi.mock('./components/UserBookingsModal', () => ({
	default: () => <div data-testid="user-bookings-modal" />,
}));
vi.mock('./components/EditUserModal', () => ({
	default: () => <div data-testid="edit-user-modal" />,
}));

const mockUsers = [
	{
		id: 1,
		name: 'John Doe',
		email: 'john@example.com',
		membershipTier: 'PAR' as const,
		membershipStatus: 'ACTIVE' as const,
		role: 'user' as const,
	},
	{
		id: 2,
		name: 'Jane Smith',
		email: 'jane@example.com',
		membershipTier: undefined,
		membershipStatus: undefined,
		role: 'user' as const,
	},
];

describe('AdminUsers', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
		vi.clearAllMocks();
	});

	const renderUsers = () => {
		return render(
			<QueryClientProvider client={queryClient}>
				<SnackbarProvider>
					<ThemeProvider theme={theme}>
						<Users />
					</ThemeProvider>
				</SnackbarProvider>
			</QueryClientProvider>,
		);
	};

	it('should render users table correctly', async () => {
		vi.mocked(getAllUsers).mockResolvedValue(mockUsers);
		renderUsers();

		expect(await screen.findByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('jane@example.com')).toBeInTheDocument();
	});

	it('should filter users based on search input', async () => {
		vi.mocked(getAllUsers).mockResolvedValue(mockUsers);
		renderUsers();

		await screen.findByText('John Doe');
		const searchInput = screen.getByPlaceholderText(/Search users/i);
		fireEvent.change(searchInput, { target: { value: 'Jane' } });

		expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
		expect(screen.getByText('Jane Smith')).toBeInTheDocument();
	});

	it('should open edit modal when edit button clicked', async () => {
		vi.mocked(getAllUsers).mockResolvedValue(mockUsers);
		renderUsers();

		await screen.findByText('John Doe');
		const actionButtons = screen.getAllByRole('button');
		// Find edit button (usually the second one for each row if we have 2 actions)
		fireEvent.click(actionButtons[1]); // John's view
		fireEvent.click(actionButtons[2]); // John's edit

		expect(screen.getByTestId('edit-user-modal')).toBeInTheDocument();
	});
});
