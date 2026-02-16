import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import NotFound from './NotFound';

const mockPush = vi.fn();
const mockBack = vi.fn();

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush,
		back: mockBack,
	}),
}));

describe('NotFound Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	vi.mock('@layout', () => ({
		SEO: () => null,
	}));

	it('renders 404 heading and error message', () => {
		render(<NotFound />);

		expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
		expect(
			screen.getByRole('heading', { name: /Page Not Found/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(/the page you're looking for doesn't exist/i),
		).toBeInTheDocument();
	});

	it('renders error icon', () => {
		render(<NotFound />);

		// MUI ErrorOutlineIcon renders as an svg
		const container = screen.getByRole('heading', {
			name: /404/i,
		}).parentElement;
		expect(container?.querySelector('svg')).toBeInTheDocument();
	});

	it('navigates to home when "Go to Home" button is clicked', async () => {
		const user = userEvent.setup();
		render(<NotFound />);

		const homeButton = screen.getByRole('button', { name: /Go to Home/i });
		await user.click(homeButton);

		expect(mockPush).toHaveBeenCalledWith('/');
	});

	it('navigates back when "Go Back" button is clicked', async () => {
		const user = userEvent.setup();
		render(<NotFound />);

		const backButton = screen.getByRole('button', { name: /Go Back/i });
		await user.click(backButton);

		expect(mockBack).toHaveBeenCalled();
	});

	it('renders both navigation buttons', () => {
		render(<NotFound />);

		expect(
			screen.getByRole('button', { name: /Go to Home/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Go Back/i }),
		).toBeInTheDocument();
	});
});
