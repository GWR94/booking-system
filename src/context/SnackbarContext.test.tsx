import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { SnackbarProvider, useSnackbar } from './SnackbarContext';

// Helper component to trigger snackbar
const TestComponent = () => {
	const { showSnackbar, hideSnackbar } = useSnackbar();
	return (
		<div>
			<button onClick={() => showSnackbar('Test Message', 'success')}>
				Show Success
			</button>
			<button onClick={() => showSnackbar('Test Error', 'error')}>
				Show Error
			</button>
			<button onClick={hideSnackbar}>Hide</button>
		</div>
	);
};

// Helper to test setBottomOffset
const OffsetComponent = () => {
	const { showSnackbar, setBottomOffset } = useSnackbar();
	return (
		<div>
			<button onClick={() => setBottomOffset(100)}>Set Offset</button>
			<button onClick={() => showSnackbar('With offset', 'info')}>
				Show
			</button>
		</div>
	);
};

// Error boundary helper
const ErrorTester = () => {
	useSnackbar();
	return null;
};

describe('SnackbarContext', () => {
	it('renders children correctly', () => {
		render(
			<SnackbarProvider>
				<div>Child Content</div>
			</SnackbarProvider>,
		);
		expect(screen.getByText('Child Content')).toBeInTheDocument();
	});

	it('shows snackbar when triggered', async () => {
		const user = userEvent.setup();
		render(
			<SnackbarProvider>
				<TestComponent />
			</SnackbarProvider>,
		);

		await user.click(screen.getByText('Show Success'));

		// Look for the alert within the snackbar
		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent('Test Message');
	});

	it('hides snackbar when requested', async () => {
		const user = userEvent.setup();
		render(
			<SnackbarProvider>
				<TestComponent />
			</SnackbarProvider>,
		);

		await user.click(screen.getByText('Show Error'));
		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent('Test Error');

		await user.click(screen.getByText('Hide'));

		await waitFor(() => {
			expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		});
	});

	it('throws error when used outside provider', () => {
		// Suppress console.error for this specific test as React logs the error
		const consoleSpy = vi.spyOn(console, 'error');
		consoleSpy.mockImplementation(() => {});

		expect(() => render(<ErrorTester />)).toThrow(
			'useSnackbar must be used within a SnackbarProvider',
		);

		consoleSpy.mockRestore();
	});

	it('setBottomOffset can be called without throwing', async () => {
		const user = userEvent.setup();
		render(
			<SnackbarProvider>
				<OffsetComponent />
			</SnackbarProvider>,
		);

		await user.click(screen.getByText('Set Offset'));
		await user.click(screen.getByText('Show'));

		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent('With offset');
	});
});
