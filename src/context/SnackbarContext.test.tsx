import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	SnackbarProvider,
	useSnackbar,
	SnackbarContext,
} from './SnackbarContext';
import { useContext } from 'react';

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
});
