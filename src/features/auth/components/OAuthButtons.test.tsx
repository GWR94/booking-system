import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import OAuthButtons from './OAuthButtons';
import { signIn } from 'next-auth/react';

describe('OAuthButtons', () => {
	it('should render Google, Facebook, and Twitter buttons', () => {
		render(<OAuthButtons />);

		expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument();
		expect(screen.getByText(/Continue with Facebook/i)).toBeInTheDocument();
		expect(screen.getByText(/Continue with X/i)).toBeInTheDocument();
	});

	it('should call signIn with correct provider when buttons are clicked', async () => {
		const user = userEvent.setup();
		render(<OAuthButtons />);

		// Test Google button
		const googleBtn = screen.getByText(/Continue with Google/i);
		await user.click(googleBtn);
		expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/book' });

		// Test Facebook button
		const facebookBtn = screen.getByText(/Continue with Facebook/i);
		await user.click(facebookBtn);
		expect(signIn).toHaveBeenCalledWith('facebook', { callbackUrl: '/book' });

		// Test Twitter/X button
		const twitterBtn = screen.getByText(/Continue with X/i);
		await user.click(twitterBtn);
		expect(signIn).toHaveBeenCalledWith('twitter', { callbackUrl: '/book' });
	});
});
