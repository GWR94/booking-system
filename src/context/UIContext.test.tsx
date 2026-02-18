import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UIProvider, useUI } from './UIContext';

const TestComponent = () => {
	const {
		isAuthModalOpen,
		authModalView,
		openAuthModal,
		closeAuthModal,
		toggleAuthModalView,
	} = useUI();
	return (
		<div>
			<div data-testid="open">{String(isAuthModalOpen)}</div>
			<div data-testid="view">{authModalView}</div>
			<button onClick={() => openAuthModal()}>Open Login</button>
			<button onClick={() => openAuthModal('register')}>Open Register</button>
			<button onClick={closeAuthModal}>Close</button>
			<button onClick={toggleAuthModalView}>Toggle View</button>
		</div>
	);
};

const ErrorTester = () => {
	useUI();
	return null;
};

describe('UIContext', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders children correctly', () => {
		render(
			<UIProvider>
				<div>Child Content</div>
			</UIProvider>,
		);
		expect(screen.getByText('Child Content')).toBeInTheDocument();
	});

	it('starts with modal closed and login view', () => {
		render(
			<UIProvider>
				<TestComponent />
			</UIProvider>,
		);

		expect(screen.getByTestId('open')).toHaveTextContent('false');
		expect(screen.getByTestId('view')).toHaveTextContent('login');
	});

	it('openAuthModal opens modal and defaults to login view', async () => {
		const user = userEvent.setup();
		render(
			<UIProvider>
				<TestComponent />
			</UIProvider>,
		);

		await user.click(screen.getByText('Open Login'));

		expect(screen.getByTestId('open')).toHaveTextContent('true');
		expect(screen.getByTestId('view')).toHaveTextContent('login');
	});

	it('openAuthModal with register opens modal with register view', async () => {
		const user = userEvent.setup();
		render(
			<UIProvider>
				<TestComponent />
			</UIProvider>,
		);

		await user.click(screen.getByText('Open Register'));

		expect(screen.getByTestId('open')).toHaveTextContent('true');
		expect(screen.getByTestId('view')).toHaveTextContent('register');
	});

	it('closeAuthModal closes the modal', async () => {
		const user = userEvent.setup();
		render(
			<UIProvider>
				<TestComponent />
			</UIProvider>,
		);

		await user.click(screen.getByText('Open Login'));
		expect(screen.getByTestId('open')).toHaveTextContent('true');

		await user.click(screen.getByText('Close'));
		expect(screen.getByTestId('open')).toHaveTextContent('false');
	});

	it('toggleAuthModalView switches from login to register', async () => {
		const user = userEvent.setup();
		render(
			<UIProvider>
				<TestComponent />
			</UIProvider>,
		);

		expect(screen.getByTestId('view')).toHaveTextContent('login');
		await user.click(screen.getByText('Toggle View'));
		expect(screen.getByTestId('view')).toHaveTextContent('register');
		await user.click(screen.getByText('Toggle View'));
		expect(screen.getByTestId('view')).toHaveTextContent('login');
	});

	it('throws when useUI is used outside UIProvider', () => {
		const consoleSpy = vi.spyOn(console, 'error');
		consoleSpy.mockImplementation(() => {});

		expect(() => render(<ErrorTester />)).toThrow(
			'useUI must be used within a UIProvider',
		);

		consoleSpy.mockRestore();
	});
});
