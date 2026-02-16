import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TestPaymentNotice from './TestPaymentNotice';
import createWrapper from '@utils/test-utils';

describe('TestPaymentNotice', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Set VITE_STRIPE_PUBLISHABLE_KEY to ensure notice renders
		process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123';
	});

	it('should render notice when in test mode', () => {
		render(<TestPaymentNotice />, { wrapper: createWrapper() });
		expect(screen.getByText(/Test Mode Active/i)).toBeInTheDocument();
		expect(screen.getByText(/4242 4242 4242 4242/i)).toBeInTheDocument();
	});

	it('should hide notice when close button is clicked', async () => {
		render(<TestPaymentNotice />, { wrapper: createWrapper() });
		const closeBtn = screen.getByRole('button', { name: /close/i });
		fireEvent.click(closeBtn);

		// RTL Collapse might take time to disappear, but basically isVisible becomes false
		// We can check if the element is removed from DOM after some time or just check the state if we exported it
		// But usually we just wait for it to be gone
		await waitFor(() => {
			expect(screen.queryByText(/Test Mode Active/i)).not.toBeInTheDocument();
		});
	});

	it('should copy card number to clipboard on click', async () => {
		const mockClipboard = {
			writeText: vi.fn().mockResolvedValue(undefined),
		};
		(global.navigator as any).clipboard = mockClipboard;

		render(<TestPaymentNotice />, { wrapper: createWrapper() });
		const copyBtn = screen.getByText(/4242 4242 4242 4242/i);
		fireEvent.click(copyBtn);

		expect(mockClipboard.writeText).toHaveBeenCalledWith('4242 4242 4242 4242');
	});

	it('should not render when not in test mode', () => {
		process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_live_123';
		render(<TestPaymentNotice />, { wrapper: createWrapper() });
		expect(screen.queryByText(/Test Mode Active/i)).not.toBeInTheDocument();
	});
});

import { waitFor } from '@testing-library/react';
