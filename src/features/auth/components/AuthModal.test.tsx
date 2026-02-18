import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import AuthModal from './AuthModal';
import { useUI } from '@context';
import createWrapper from '@utils/test-utils';

vi.mock('@context', () => ({
	useUI: vi.fn(),
	useSnackbar: vi.fn(() => ({ showSnackbar: vi.fn() })),
}));

const renderAuthModal = () => {
	return render(<AuthModal />, { wrapper: createWrapper() });
};

describe('AuthModal', () => {
	const closeAuthModal = vi.fn();
	const toggleAuthModalView = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		(useUI as ReturnType<typeof vi.fn>).mockReturnValue({
			isAuthModalOpen: true,
			closeAuthModal,
			authModalView: 'login',
			toggleAuthModalView,
		});
	});

	it('renders when open and shows Sign In title in login view', () => {
		renderAuthModal();
		expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
	});

	it('renders Create Account title when authModalView is register', () => {
		(useUI as ReturnType<typeof vi.fn>).mockReturnValue({
			isAuthModalOpen: true,
			closeAuthModal,
			authModalView: 'register',
			toggleAuthModalView,
		});
		renderAuthModal();
		expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
	});

	it('calls closeAuthModal when close button is clicked', () => {
		renderAuthModal();
		fireEvent.click(screen.getByLabelText('close'));
		expect(closeAuthModal).toHaveBeenCalled();
	});

	it('renders login form and OAuth section when in login view', () => {
		renderAuthModal();
		expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
		expect(screen.getByText((content) => content.trim() === 'or')).toBeInTheDocument();
	});

	it('renders dialog with Sign In when open', () => {
		(useUI as ReturnType<typeof vi.fn>).mockReturnValue({
			isAuthModalOpen: true,
			closeAuthModal,
			authModalView: 'login',
			toggleAuthModalView,
		});
		renderAuthModal();
		expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
	});
});
