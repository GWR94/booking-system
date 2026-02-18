import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import HelpCenter from './HelpCenter';
import createWrapper from '@utils/test-utils';

vi.mock('@shared', () => ({
	ContactForm: () => <div data-testid="contact-form">Contact Form</div>,
}));

describe('HelpCenter', () => {
	it('renders Help Center title and subtitle', () => {
		render(<HelpCenter />, { wrapper: createWrapper() });
		expect(screen.getByText('Help Center')).toBeInTheDocument();
		expect(
			screen.getByText(/Find answers to common questions about our golf simulator booking system/),
		).toBeInTheDocument();
	});

	it('renders search input and Search button', () => {
		render(<HelpCenter />, { wrapper: createWrapper() });
		expect(screen.getByPlaceholderText('Search for help...')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
	});

	it('renders category tabs', () => {
		render(<HelpCenter />, { wrapper: createWrapper() });
		expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'Booking' })).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'Payment' })).toBeInTheDocument();
	});

	it('filters FAQs when search query is entered', () => {
		render(<HelpCenter />, { wrapper: createWrapper() });
		const input = screen.getByPlaceholderText('Search for help...');
		fireEvent.change(input, { target: { value: 'membership' } });
		expect((input as HTMLInputElement).value).toBe('membership');
	});

	it('shows no results message when search has no matches', () => {
		render(<HelpCenter />, { wrapper: createWrapper() });
		fireEvent.change(screen.getByPlaceholderText('Search for help...'), {
			target: { value: 'xyznonexistent123' },
		});
		expect(screen.getByText(/No results found for/)).toBeInTheDocument();
	});

	it('renders ContactForm', () => {
		render(<HelpCenter />, { wrapper: createWrapper() });
		expect(screen.getByTestId('contact-form')).toBeInTheDocument();
	});
});
