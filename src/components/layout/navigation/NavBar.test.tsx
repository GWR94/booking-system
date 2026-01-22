import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import NavBar from './NavBar';
import createWrapper from '@utils/test-utils';
import { useAuth, useBasket } from '@hooks';
import { ThemeProvider } from '@context';

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
	useScroll: () => ({
		scrollY: {
			get: () => 0,
			getPrevious: () => 0,
			on: () => {},
		},
	}),
	useMotionValueEvent: () => {},
}));

vi.mock('@hooks', () => ({
	useAuth: vi.fn(),
	useBasket: vi.fn(),
}));

vi.mock('@context', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useUI: () => ({
			openAuthModal: vi.fn(),
		}),
	};
});

// Mock sub-components
// Mock sub-components
vi.mock('./Basket', () => ({
	default: () => <div data-testid="mock-basket" />,
}));
vi.mock('./DesktopNavigation', () => ({
	default: () => <div data-testid="mock-desktop-nav" />,
}));
vi.mock('./AccountButton', () => ({
	default: () => <div data-testid="mock-account-button" />,
}));
vi.mock('./NavBarDropdown', () => ({
	default: () => <div data-testid="mock-mobile-menu" />,
}));
vi.mock('./AdminMenuButton', () => ({
	default: () => <div data-testid="mock-admin-button" />,
}));

describe('NavBar', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as any).mockReturnValue({
			isAuthenticated: false,
			user: null,
			isLoading: false,
		});
		(useBasket as any).mockReturnValue({
			basket: [],
			basketPrice: '0.00',
		});
	});

	it('should render navigation sub-components', async () => {
		render(
			<ThemeProvider>
				<NavBar />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(await screen.findByTestId('mock-desktop-nav')).toBeInTheDocument();
		expect(await screen.findByTestId('mock-basket')).toBeInTheDocument();
		expect(
			await screen.findByTestId('mock-account-button'),
		).toBeInTheDocument();
	});

	it('should render logo', () => {
		render(
			<ThemeProvider>
				<NavBar />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(screen.getByRole('banner')).toBeInTheDocument();
	});
});
