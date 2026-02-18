import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import CheckoutFooter from './CheckoutFooter';
import { useBasket } from '@hooks';
import createWrapper from '@utils/test-utils';

vi.mock('@hooks', () => ({
	useBasket: vi.fn(),
}));

describe('CheckoutFooter', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(useBasket as ReturnType<typeof vi.fn>).mockReturnValue({
			basket: [],
			basketPrice: '0',
			clearBasket: vi.fn(),
		});
	});

	it('does not show footer content when basket is empty', () => {
		render(<CheckoutFooter />, { wrapper: createWrapper() });
		expect(screen.queryByText(/Slot.*Selected/)).not.toBeInTheDocument();
	});

	it('shows slot count and price when basket has items', () => {
		(useBasket as ReturnType<typeof vi.fn>).mockReturnValue({
			basket: [{ id: 1, bayId: 1 } as any],
			basketPrice: '25',
			clearBasket: vi.fn(),
		});
		render(<CheckoutFooter />, { wrapper: createWrapper() });
		expect(screen.getByText(/1 Slot Selected/)).toBeInTheDocument();
		expect(screen.getByText('£25')).toBeInTheDocument();
	});

	it('shows Slots (plural) when basket has multiple items', () => {
		(useBasket as ReturnType<typeof vi.fn>).mockReturnValue({
			basket: [{ id: 1 }, { id: 2 }] as any[],
			basketPrice: '50',
			clearBasket: vi.fn(),
		});
		render(<CheckoutFooter />, { wrapper: createWrapper() });
		expect(screen.getByText(/2 Slots Selected/)).toBeInTheDocument();
	});

	it('calls clearBasket when Clear is clicked', () => {
		const clearBasket = vi.fn();
		(useBasket as ReturnType<typeof vi.fn>).mockReturnValue({
			basket: [{}] as any[],
			basketPrice: '25',
			clearBasket,
		});
		render(<CheckoutFooter />, { wrapper: createWrapper() });
		fireEvent.click(screen.getByRole('button', { name: /Clear/i }));
		expect(clearBasket).toHaveBeenCalled();
	});

	it('renders Checkout button linking to /checkout', () => {
		(useBasket as ReturnType<typeof vi.fn>).mockReturnValue({
			basket: [{}] as any[],
			basketPrice: '25',
			clearBasket: vi.fn(),
		});
		render(<CheckoutFooter />, { wrapper: createWrapper() });
		const checkoutBtn = screen.getByRole('link', { name: /Checkout/i });
		expect(checkoutBtn).toHaveAttribute('href', '/checkout');
	});
});
