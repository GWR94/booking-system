import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminLayoutClient from './AdminLayoutClient';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const mockPush = vi.fn();
const mockLogout = vi.fn();
const mockUsePathname = vi.fn();

vi.mock('next/navigation', () => ({
	useRouter: () => ({ push: mockPush, replace: vi.fn(), back: vi.fn() }),
	usePathname: () => mockUsePathname(),
}));

vi.mock('@hooks', () => ({
	useAuth: () => ({
		user: { name: 'Admin User', email: 'admin@example.com' },
		logout: mockLogout,
	}),
}));

vi.mock('@layout', () => ({
	NavBar: () => <div data-testid="navbar">NavBar</div>,
	Footer: () => <div data-testid="footer">Footer</div>,
	ADMIN_MENU_ITEMS: [
		{ label: 'Dashboard', path: '/admin/dashboard', Icon: () => null },
		{ label: 'Bookings', path: '/admin/bookings', Icon: () => null },
		{ label: 'Users', path: '/admin/users', Icon: () => null },
		{ label: 'Block Outs', path: '/admin/block-outs', Icon: () => null },
	],
}));

const theme = createTheme();

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AdminLayoutClient', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUsePathname.mockReturnValue('/admin/dashboard');
	});

	it('renders admin portal heading and description', () => {
		renderWithTheme(
			<AdminLayoutClient>
				<div>Page content</div>
			</AdminLayoutClient>,
		);

		expect(
			screen.getByRole('heading', { name: /Admin Portal/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Managing the Booking System/i),
		).toBeInTheDocument();
	});

	it('renders user initials in avatar when user has name', () => {
		renderWithTheme(
			<AdminLayoutClient>
				<div>Page content</div>
			</AdminLayoutClient>,
		);

		expect(screen.getByText('AU')).toBeInTheDocument(); // Admin User -> AU
	});

	it('renders breadcrumbs with Home and Admin', () => {
		renderWithTheme(
			<AdminLayoutClient>
				<div>Page content</div>
			</AdminLayoutClient>,
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Admin')).toBeInTheDocument();
	});

	it('renders Management sidebar with all menu items', () => {
		renderWithTheme(
			<AdminLayoutClient>
				<div>Page content</div>
			</AdminLayoutClient>,
		);

		expect(screen.getByText('Management')).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: /Dashboard/i })).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: /Bookings/i })).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: /Users/i })).toBeInTheDocument();
		expect(
			screen.getByRole('menuitem', { name: /Block Outs/i }),
		).toBeInTheDocument();
	});

	it('renders Logout menu item', () => {
		renderWithTheme(
			<AdminLayoutClient>
				<div>Page content</div>
			</AdminLayoutClient>,
		);

		expect(screen.getByRole('menuitem', { name: /Logout/i })).toBeInTheDocument();
	});

	it('renders NavBar and Footer', () => {
		renderWithTheme(
			<AdminLayoutClient>
				<div>Page content</div>
			</AdminLayoutClient>,
		);

		expect(screen.getByTestId('navbar')).toBeInTheDocument();
		expect(screen.getByTestId('footer')).toBeInTheDocument();
	});

	it('renders children in main content area', () => {
		renderWithTheme(
			<AdminLayoutClient>
				<div data-testid="admin-page-content">Page content</div>
			</AdminLayoutClient>,
		);

		expect(screen.getByTestId('admin-page-content')).toHaveTextContent(
			'Page content',
		);
	});

	it('navigates to Bookings when Bookings menu item is clicked', async () => {
		const user = userEvent.setup();
		renderWithTheme(
			<AdminLayoutClient>
				<div>Page content</div>
			</AdminLayoutClient>,
		);

		await user.click(screen.getByRole('menuitem', { name: /Bookings/i }));

		expect(mockPush).toHaveBeenCalledWith('/admin/bookings');
	});

	it('calls logout when Logout menu item is clicked', async () => {
		const user = userEvent.setup();
		renderWithTheme(
			<AdminLayoutClient>
				<div>Page content</div>
			</AdminLayoutClient>,
		);

		await user.click(screen.getByRole('menuitem', { name: /Logout/i }));

		expect(mockLogout).toHaveBeenCalled();
	});

	it('navigates to home when Home breadcrumb is clicked', async () => {
		const user = userEvent.setup();
		renderWithTheme(
			<AdminLayoutClient>
				<div>Page content</div>
			</AdminLayoutClient>,
		);

		await user.click(screen.getByText('Home'));

		expect(mockPush).toHaveBeenCalledWith('/');
	});
});
