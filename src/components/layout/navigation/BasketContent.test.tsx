import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import BasketContent from './BasketContent';
import createWrapper from '@utils/test-utils';
import { useBasket, useAuth } from '@hooks';
import { useUI, ThemeProvider } from '@context';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock('@hooks', () => ({
	useBasket: vi.fn(),
	useAuth: vi.fn(),
}));

vi.mock('@context', () => ({
	useUI: vi.fn(),
	ThemeProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('./EmptyBasket', () => ({
	default: () => <div data-testid="mock-empty-basket" />,
}));

vi.mock('./BasketItem', () => ({
	default: ({ item }: { item: any }) => (
		<div data-testid={`mock-basket-item-${item.id}`}>{item.id}</div>
	),
}));

describe('BasketContent', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as any).mockReturnValue({ isAuthenticated: false });
		(useBasket as any).mockReturnValue({
			basket: [],
			basketPrice: '0.00',
			clearBasket: vi.fn(),
		});
	});

	it('should render empty state when basket is empty', () => {
		const mockOpenAuthModal = vi.fn();
		(useUI as any).mockReturnValue({ openAuthModal: mockOpenAuthModal });
		render(
			<ThemeProvider>
				<BasketContent isMobile={false} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(screen.getByTestId('mock-empty-basket')).toBeInTheDocument();
	});

	it('should render items when basket has contents', () => {
		(useBasket as any).mockReturnValue({
			basket: [{ id: '1' }, { id: '2' }],
			basketPrice: '20.00',
			clearBasket: vi.fn(),
		});

		render(
			<ThemeProvider>
				<BasketContent isMobile={false} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(screen.getByTestId('mock-basket-item-1')).toBeInTheDocument();
		expect(screen.getByTestId('mock-basket-item-2')).toBeInTheDocument();
		expect(screen.getByText('£20.00')).toBeInTheDocument();
	});

	it('should call clearBasket when Clear Basket button is clicked', () => {
		const mockClear = vi.fn();
		(useBasket as any).mockReturnValue({
			basket: [{ id: '1' }],
			basketPrice: '10.00',
			clearBasket: mockClear,
		});

		render(
			<ThemeProvider>
				<BasketContent isMobile={false} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		fireEvent.click(screen.getByText(/Clear Basket/i));
		expect(mockClear).toHaveBeenCalled();
	});

	it('should navigate to checkout when Continue button is clicked (authenticated)', () => {
		(useAuth as any).mockReturnValue({ isAuthenticated: true });
		(useBasket as any).mockReturnValue({
			basket: [{ id: '1' }],
			basketPrice: '10.00',
			clearBasket: vi.fn(),
		});

		render(
			<ThemeProvider>
				<BasketContent isMobile={false} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		fireEvent.click(screen.getByText(/Continue to Checkout/i));
		expect(mockNavigate).toHaveBeenCalledWith('/checkout');
	});

	it('should open auth modal when Continue button is clicked (unauthenticated)', () => {
		const mockOpenAuthModal = vi.fn();
		(useUI as any).mockReturnValue({ openAuthModal: mockOpenAuthModal });
		(useAuth as any).mockReturnValue({ isAuthenticated: false });
		(useBasket as any).mockReturnValue({
			basket: [{ id: '1' }],
			basketPrice: '10.00',
			clearBasket: vi.fn(),
		});

		render(
			<ThemeProvider>
				<BasketContent isMobile={false} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		fireEvent.click(screen.getByText(/Sign in and Checkout/i));
		expect(mockOpenAuthModal).toHaveBeenCalledWith('login');
	});

	it('should navigate to guest checkout when Guest Checkout button is clicked', () => {
		(useAuth as any).mockReturnValue({ isAuthenticated: false });
		(useBasket as any).mockReturnValue({
			basket: [{ id: '1' }],
			basketPrice: '10.00',
			clearBasket: vi.fn(),
		});

		render(
			<ThemeProvider>
				<BasketContent isMobile={false} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		fireEvent.click(screen.getByText(/Guest Checkout/i));
		expect(mockNavigate).toHaveBeenCalledWith('/checkout');
	});
});
