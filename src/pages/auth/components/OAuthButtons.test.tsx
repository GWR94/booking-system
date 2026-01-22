import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import OAuthButtons from './OAuthButtons';

describe('OAuthButtons', () => {
	it('should render Google, Facebook, and Twitter buttons', () => {
		render(<OAuthButtons />);

		expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument();
		expect(screen.getByText(/Continue with Facebook/i)).toBeInTheDocument();
		expect(screen.getByText(/Continue with X/i)).toBeInTheDocument();
	});

	it('should have correct hrefs for OAuth providers', () => {
		render(<OAuthButtons />);
		const backendUrl = import.meta.env.VITE_BACKEND_API;

		const googleBtn = screen.getByText(/Continue with Google/i).closest('a');
		const facebookBtn = screen
			.getByText(/Continue with Facebook/i)
			.closest('a');
		const twitterBtn = screen.getByText(/Continue with X/i).closest('a');

		expect(googleBtn).toHaveAttribute(
			'href',
			`${backendUrl}/api/user/login/google`,
		);
		expect(facebookBtn).toHaveAttribute(
			'href',
			`${backendUrl}/api/user/login/facebook`,
		);
		expect(twitterBtn).toHaveAttribute(
			'href',
			`${backendUrl}/api/user/login/twitter`,
		);
	});
});
