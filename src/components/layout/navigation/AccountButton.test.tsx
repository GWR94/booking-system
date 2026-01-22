import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AccountButton from './AccountButton';
import { useAuth } from '@hooks';
import { ThemeProvider } from '@context';

const mockNavigate = vi.fn();
const mockLogout = vi.fn();
const mockOpenAuthModal = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock('@hooks', () => ({
	useAuth: vi.fn(),
}));

vi.mock('@context', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useUI: () => ({
			openAuthModal: mockOpenAuthModal,
		}),
	};
});

describe('AccountButton', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as any).mockReturnValue({
			isAuthenticated: false,
			user: null,
			logout: mockLogout,
		});
	});

	it('should render login/register options when unauthenticated', async () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<AccountButton />
				</BrowserRouter>
			</ThemeProvider>,
		);

		const btn = screen.getByRole('button');
		fireEvent.click(btn);

		expect(await screen.findByText('Login')).toBeInTheDocument();
		expect(await screen.findByText('Register')).toBeInTheDocument();
	});

	it('should render profile/logout options when authenticated', async () => {
		(useAuth as any).mockReturnValue({
			isAuthenticated: true,
			user: { name: 'John Doe', email: 'john@example.com' },
			logout: mockLogout,
		});

		render(
			<ThemeProvider>
				<BrowserRouter>
					<AccountButton />
				</BrowserRouter>
			</ThemeProvider>,
		);

		const btn = screen.getByRole('button');
		fireEvent.click(btn);

		expect(await screen.findByText('John Doe')).toBeInTheDocument();
		// It might show "Profile" as a dropdown label or "Overview" depending on menuItems.ts
		// But in ProfileMenuItems, label is 'Overview', dropdownLabel is 'Profile'.
		expect(await screen.findByText('Profile')).toBeInTheDocument();
		expect(await screen.findByText('Logout')).toBeInTheDocument();
	});

	it('should call logout when Logout item is clicked', async () => {
		(useAuth as any).mockReturnValue({
			isAuthenticated: true,
			user: { name: 'John Doe' },
			logout: mockLogout,
		});

		render(
			<ThemeProvider>
				<BrowserRouter>
					<AccountButton />
				</BrowserRouter>
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByRole('button'));
		const logoutItem = await screen.findByText('Logout');
		fireEvent.click(logoutItem);

		expect(mockLogout).toHaveBeenCalled();
	});
});
