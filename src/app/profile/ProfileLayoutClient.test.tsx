import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfileLayoutClient from './ProfileLayoutClient';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const mockPush = vi.fn();
const mockLogout = vi.fn();
const mockUsePathname = vi.fn();

vi.mock('next/navigation', () => ({
	useRouter: () => ({ push: mockPush, replace: vi.fn(), back: vi.fn() }),
	usePathname: () => mockUsePathname(),
}));

const mockUseAuth = vi.fn(() => ({
	user: { name: 'Jane Doe', email: 'jane@example.com' },
	logout: mockLogout,
}));

vi.mock('@hooks', () => ({
	useAuth: () => mockUseAuth(),
}));

vi.mock('@layout', () => ({
	NavBar: () => <div data-testid="navbar">NavBar</div>,
	Footer: () => <div data-testid="footer">Footer</div>,
	PROFILE_MENU_ITEMS: [
		{ label: 'Overview', path: '/profile/overview', Icon: () => null },
		{ label: 'My Bookings', path: '/profile/bookings', Icon: () => null },
		{ label: 'Settings', path: '/profile/settings', Icon: () => null },
	],
}));

const theme = createTheme();

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ProfileLayoutClient', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUsePathname.mockReturnValue('/profile/overview');
	});

	it('renders user name and email in header', () => {
		renderWithTheme(
			<ProfileLayoutClient>
				<div>Profile content</div>
			</ProfileLayoutClient>,
		);

		expect(
			screen.getByRole('heading', { name: /Jane Doe/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/jane@example\.com/i)).toBeInTheDocument();
	});

	it('renders user initials in avatar when user has name', () => {
		renderWithTheme(
			<ProfileLayoutClient>
				<div>Profile content</div>
			</ProfileLayoutClient>,
		);

		expect(screen.getByText('JD')).toBeInTheDocument(); // Jane Doe -> JD
	});

	it('renders breadcrumbs with Home and Profile', () => {
		renderWithTheme(
			<ProfileLayoutClient>
				<div>Profile content</div>
			</ProfileLayoutClient>,
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Profile')).toBeInTheDocument();
	});

	it('renders Account Settings sidebar with all menu items', () => {
		renderWithTheme(
			<ProfileLayoutClient>
				<div>Profile content</div>
			</ProfileLayoutClient>,
		);

		expect(
			screen.getByText('Account Settings'),
		).toBeInTheDocument();
		expect(
			screen.getByRole('menuitem', { name: /Overview/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole('menuitem', { name: /My Bookings/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole('menuitem', { name: /Settings/i }),
		).toBeInTheDocument();
	});

	it('renders Logout menu item', () => {
		renderWithTheme(
			<ProfileLayoutClient>
				<div>Profile content</div>
			</ProfileLayoutClient>,
		);

		expect(screen.getByRole('menuitem', { name: /Logout/i })).toBeInTheDocument();
	});

	it('renders NavBar and Footer', () => {
		renderWithTheme(
			<ProfileLayoutClient>
				<div>Profile content</div>
			</ProfileLayoutClient>,
		);

		expect(screen.getByTestId('navbar')).toBeInTheDocument();
		expect(screen.getByTestId('footer')).toBeInTheDocument();
	});

	it('renders children in main content area', () => {
		renderWithTheme(
			<ProfileLayoutClient>
				<div data-testid="profile-page-content">Profile content</div>
			</ProfileLayoutClient>,
		);

		expect(screen.getByTestId('profile-page-content')).toHaveTextContent(
			'Profile content',
		);
	});

	it('navigates to Settings when Settings menu item is clicked', async () => {
		const user = userEvent.setup();
		renderWithTheme(
			<ProfileLayoutClient>
				<div>Profile content</div>
			</ProfileLayoutClient>,
		);

		await user.click(screen.getByRole('menuitem', { name: /Settings/i }));

		expect(mockPush).toHaveBeenCalledWith('/profile/settings');
	});

	it('calls logout when Logout menu item is clicked', async () => {
		const user = userEvent.setup();
		renderWithTheme(
			<ProfileLayoutClient>
				<div>Profile content</div>
			</ProfileLayoutClient>,
		);

		await user.click(screen.getByRole('menuitem', { name: /Logout/i }));

		expect(mockLogout).toHaveBeenCalled();
	});

	it('navigates to home when Home breadcrumb is clicked', async () => {
		const user = userEvent.setup();
		renderWithTheme(
			<ProfileLayoutClient>
				<div>Profile content</div>
			</ProfileLayoutClient>,
		);

		await user.click(screen.getByText('Home'));

		expect(mockPush).toHaveBeenCalledWith('/');
	});

	it('renders fallback "User" when user has no name', () => {
		mockUseAuth.mockReturnValueOnce({
			user: { name: null, email: 'anon@example.com' },
			logout: mockLogout,
		});
		renderWithTheme(
			<ProfileLayoutClient>
				<div>Profile content</div>
			</ProfileLayoutClient>,
		);

		expect(
			screen.getByRole('heading', { name: /^User$/i }),
		).toBeInTheDocument();
	});
});
