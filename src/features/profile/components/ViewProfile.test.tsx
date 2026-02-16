import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ViewProfile from './ViewProfile';
import { useAuth } from '@hooks';
import { ThemeProvider } from '@context';

vi.mock('@hooks', () => ({
	useAuth: vi.fn(),
}));

vi.mock('@assets/icons/CustomIcons', () => ({
	FacebookIcon: () => <div data-testid="facebook-icon" />,
	GoogleIcon: () => <div data-testid="google-icon" />,
	XIcon: () => <div data-testid="x-icon" />,
}));

describe('ViewProfile', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return null if no user is present', () => {
		(useAuth as any).mockReturnValue({ user: null });
		const { container } = render(
			<ThemeProvider>
				<ViewProfile handleEditToggle={vi.fn()} />
			</ThemeProvider>,
		);
		expect(container.firstChild).toBeNull();
	});

	it('should render user information', () => {
		(useAuth as any).mockReturnValue({
			user: {
				name: 'John Doe',
				email: 'john@example.com',
				passwordHash: 'hashed',
			},
		});

		render(
			<ThemeProvider>
				<ViewProfile handleEditToggle={vi.fn()} />
			</ThemeProvider>,
		);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('john@example.com')).toBeInTheDocument();
		expect(screen.getByText('••••••••••••')).toBeInTheDocument();
	});

	it('should render social icons when present', () => {
		(useAuth as any).mockReturnValue({
			user: {
				name: 'John Social',
				email: 'social@example.com',
				googleId: 'g123',
				facebookId: 'f123',
				twitterId: 't123',
			},
		});

		render(
			<ThemeProvider>
				<ViewProfile handleEditToggle={vi.fn()} />
			</ThemeProvider>,
		);

		expect(screen.getByTestId('google-icon')).toBeInTheDocument();
		expect(screen.getByTestId('facebook-icon')).toBeInTheDocument();
		expect(screen.getByTestId('x-icon')).toBeInTheDocument();
	});

	it('should call handleEditToggle when Edit Profile is clicked', () => {
		const mockToggle = vi.fn();
		(useAuth as any).mockReturnValue({
			user: { name: 'John Doe', email: 'john@example.com' },
		});

		render(
			<ThemeProvider>
				<ViewProfile handleEditToggle={mockToggle} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText(/Edit/i));
		expect(mockToggle).toHaveBeenCalled();
	});
});
