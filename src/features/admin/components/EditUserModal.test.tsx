import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditUserModal from './EditUserModal';
import { ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from '@context';

const theme = createTheme();

// Mock API
vi.mock('@api', () => ({
	updateUserDetails: vi.fn(() => Promise.resolve()),
	resetUserPassword: vi.fn(() => Promise.resolve()),
}));

const mockUser = {
	id: 'user123',
	name: 'John Doe',
	email: 'john@example.com',
	role: 'user',
	membershipTier: 'PAR',
	membershipStatus: 'ACTIVE',
};

describe('EditUserModal', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
				mutations: { retry: false },
			},
		});
		vi.clearAllMocks();
	});

	const renderModal = (user = mockUser) => {
		return render(
			<QueryClientProvider client={queryClient}>
				<SnackbarProvider>
					<ThemeProvider theme={theme}>
						<EditUserModal user={user} open={true} onClose={vi.fn()} />
					</ThemeProvider>
				</SnackbarProvider>
			</QueryClientProvider>,
		);
	};

	it('should render initial user data', () => {
		renderModal();

		expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
		expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
		expect(screen.getByLabelText(/Role/i)).toHaveTextContent('User');
	});

	it('should handle field changes', () => {
		renderModal();

		const nameInput = screen.getByLabelText('Name');
		fireEvent.change(nameInput, {
			target: { value: 'Jane Doe', name: 'name' },
		});
		expect(nameInput).toHaveValue('Jane Doe');
	});

	it('should show password reset alert in accordion', () => {
		renderModal();

		fireEvent.click(screen.getByText('Reset Password'));
		expect(
			screen.getByText(/This will send an email to the user/i),
		).toBeInTheDocument();
	});
});
