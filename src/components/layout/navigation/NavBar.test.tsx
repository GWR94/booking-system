import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMotionValueEvent } from 'framer-motion';

import NavBar from './NavBar';
import createWrapper from '@utils/test-utils';
import { useAuth, useBasket } from '@hooks';
import { ThemeProvider } from '@context';
import { useMediaQuery } from '@mui/material';

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, animate, ...props }: any) => (
			<div data-testid="motion-div" data-animate={animate} {...props}>
				{children}
			</div>
		),
	},
	useScroll: () => ({
		scrollY: {
			get: () => 0,
			getPrevious: () => 0,
			on: () => {},
		},
	}),
	useMotionValueEvent: vi.fn(),
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
vi.mock('@mui/material', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useMediaQuery: vi.fn(),
	};
});

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

	it('should render admin menu button for admin users', async () => {
		(useAuth as any).mockReturnValue({
			isAuthenticated: true,
			user: { role: 'admin' },
		});

		render(
			<ThemeProvider>
				<NavBar />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(await screen.findByTestId('mock-admin-button')).toBeInTheDocument();
	});

	it('should toggle mobile menu when menu button is clicked', async () => {
		// Mock mobile view
		vi.mocked(useMediaQuery).mockReturnValue(true);

		render(
			<ThemeProvider>
				<NavBar />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		const menuBtn = screen.getByRole('button', { name: /toggle menu/i });
		fireEvent.click(menuBtn);

		// NavBarDropdown should be visible now (mocked as mock-mobile-menu)
		expect(await screen.findByTestId('mock-mobile-menu')).toBeInTheDocument();
	});
	it('should hide navbar on scroll down', async () => {
		let scrollCallback: (latest: number) => void = () => {};
		vi.mocked(useMotionValueEvent).mockImplementation(
			(_val, _event, callback) => {
				scrollCallback = callback;
			},
		);

		render(
			<ThemeProvider>
				<NavBar threshold={50} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		// Initially visible
		expect(screen.getByTestId('motion-div')).toHaveAttribute(
			'data-animate',
			'visible',
		);

		// Simulate scroll down (100 > 50 threshold)
		await act(async () => {
			scrollCallback(100);
		});

		await waitFor(() => {
			expect(screen.getByTestId('motion-div')).toHaveAttribute(
				'data-animate',
				'hidden',
			);
		});
	});
});
