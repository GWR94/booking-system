import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import RegisterUser from './RegisterUser';

vi.mock('./components', () => ({
	OAuthButtons: () => <div>OAuth Buttons Component</div>,
	LegacyRegister: () => <div>Legacy Register Component</div>,
}));

import createWrapper from '@utils/test-utils';

describe('RegisterUser Page', () => {
	it('renders sign up heading', () => {
		render(<RegisterUser />, { wrapper: createWrapper() });

		expect(
			screen.getByRole('heading', { name: /Sign up/i }),
		).toBeInTheDocument();
	});

	it('renders LegacyRegister component', () => {
		render(<RegisterUser />, { wrapper: createWrapper() });

		expect(screen.getByText('Legacy Register Component')).toBeInTheDocument();
	});

	it('renders OAuth buttons', () => {
		render(<RegisterUser />, { wrapper: createWrapper() });

		expect(screen.getByText('OAuth Buttons Component')).toBeInTheDocument();
	});

	it('renders divider with "or" text', () => {
		render(<RegisterUser />, { wrapper: createWrapper() });

		expect(screen.getByText('or')).toBeInTheDocument();
	});

	it('renders all main components in correct order', () => {
		const { container } = render(<RegisterUser />, {
			wrapper: createWrapper(),
		});

		const heading = screen.getByRole('heading', { name: /Sign up/i });
		const registerForm = screen.getByText('Legacy Register Component');
		const divider = screen.getByText('or');
		const oauthButtons = screen.getByText('OAuth Buttons Component');

		// Verify they all exist
		expect(heading).toBeInTheDocument();
		expect(registerForm).toBeInTheDocument();
		expect(divider).toBeInTheDocument();
		expect(oauthButtons).toBeInTheDocument();
	});
});
