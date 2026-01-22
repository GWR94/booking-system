import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import NavBarDropdown from './NavBarDropdown';
import { useAuth } from '@hooks';
import { ThemeProvider } from '@context';
import { Home } from '@mui/icons-material';

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

// Mock react-router for its location
vi.mock('react-router', async (importOriginal) => {
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

vi.mock('./BasketContent', () => ({
	default: () => <div data-testid="mock-basket-content" />,
}));

describe('NavBarDropdown', () => {
	const mockNavItems = [{ name: 'Home', path: '/', icon: <Home /> }];

	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as any).mockReturnValue({
			isAuthenticated: false,
			logout: mockLogout,
		});
	});

	it('should render navigation items when content is nav', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<NavBarDropdown
						menuContent="nav"
						isMenuOpen={true}
						setIsMenuOpen={vi.fn()}
						navItems={mockNavItems}
					/>
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
	});

	it('should render basket content when content is basket', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<NavBarDropdown
						menuContent="basket"
						isMenuOpen={true}
						setIsMenuOpen={vi.fn()}
						navItems={mockNavItems}
					/>
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByTestId('mock-basket-content')).toBeInTheDocument();
	});

	it('should show account menu when content is account and authenticated', () => {
		(useAuth as any).mockReturnValue({
			isAuthenticated: true,
			user: { name: 'Test User', email: 'test@example.com' },
			logout: mockLogout,
		});

		render(
			<ThemeProvider>
				<BrowserRouter>
					<NavBarDropdown
						menuContent="account"
						isMenuOpen={true}
						setIsMenuOpen={vi.fn()}
						navItems={mockNavItems}
					/>
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText('Test User')).toBeInTheDocument();
		expect(screen.getByText('Logout')).toBeInTheDocument();
	});

	it('should call logout when Logout is clicked', () => {
		(useAuth as any).mockReturnValue({
			isAuthenticated: true,
			user: { name: 'Test User' },
			logout: mockLogout,
		});

		render(
			<ThemeProvider>
				<BrowserRouter>
					<NavBarDropdown
						menuContent="account"
						isMenuOpen={true}
						setIsMenuOpen={vi.fn()}
						navItems={mockNavItems}
					/>
				</BrowserRouter>
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText('Logout'));
		expect(mockLogout).toHaveBeenCalled();
	});
});
