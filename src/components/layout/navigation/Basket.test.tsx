import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Basket from './Basket';
import createWrapper from '@utils/test-utils';
import { useBasket } from '@hooks';
import { ThemeProvider } from '@context';

vi.mock('@hooks', () => ({
	useBasket: vi.fn(),
}));

vi.mock('./BasketContent', () => ({
	default: ({ onClose }: { onClose: () => void }) => (
		<div data-testid="mock-basket-content">
			<button onClick={onClose} data-testid="close-basket">
				Close
			</button>
		</div>
	),
}));

describe('Basket', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(useBasket as any).mockReturnValue({
			basket: [],
		});
	});

	it('should render basket icon with badge count', () => {
		(useBasket as any).mockReturnValue({
			basket: [{ id: '1' }, { id: '2' }],
		});

		render(
			<ThemeProvider>
				<Basket isMobile={false} onMobileBasketClick={vi.fn()} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(screen.getByTestId('ShoppingCartIcon')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
	});

	it('should open popover on desktop when clicked', async () => {
		render(
			<ThemeProvider>
				<Basket isMobile={false} onMobileBasketClick={vi.fn()} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		const basketBtn = screen.getByRole('button');
		fireEvent.click(basketBtn);

		expect(
			await screen.findByTestId('mock-basket-content'),
		).toBeInTheDocument();
	});

	it('should call onMobileBasketClick on mobile when clicked', () => {
		const mockMobileClick = vi.fn();
		render(
			<ThemeProvider>
				<Basket isMobile={true} onMobileBasketClick={mockMobileClick} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		const basketBtn = screen.getByRole('button');
		fireEvent.click(basketBtn);

		expect(mockMobileClick).toHaveBeenCalled();
		expect(screen.queryByTestId('mock-basket-content')).not.toBeInTheDocument();
	});

	it('should close popover when onClose is called from content', async () => {
		render(
			<ThemeProvider>
				<Basket isMobile={false} onMobileBasketClick={vi.fn()} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		fireEvent.click(screen.getByRole('button'));
		expect(
			await screen.findByTestId('mock-basket-content'),
		).toBeInTheDocument();

		fireEvent.click(screen.getByTestId('close-basket'));

		await waitFor(() => {
			expect(
				screen.queryByTestId('mock-basket-content'),
			).not.toBeInTheDocument();
		});
	});
});
