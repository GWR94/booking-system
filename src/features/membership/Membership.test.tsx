import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Membership from './Membership';

vi.mock('./components', () => ({
	FAQ: () => <div>FAQ Component</div>,
	Tiers: () => <div>Tiers Component</div>,
	CallToAction: () => <div>Call To Action Component</div>,
	HowItWorks: () => <div>How It Works Component</div>,
}));

import createWrapper from '@utils/test-utils';

describe('Membership Page', () => {
	it('renders Membership Plans heading', () => {
		render(<Membership />, { wrapper: createWrapper() });

		expect(
			screen.getByRole('heading', { name: /Membership Plans/i }),
		).toBeInTheDocument();
	});

	it('renders subtitle about membership benefits', () => {
		render(<Membership />, { wrapper: createWrapper() });

		expect(
			screen.getByText(/Choose the perfect membership plan/i),
		).toBeInTheDocument();
	});

	it('renders all membership components', () => {
		render(<Membership />, { wrapper: createWrapper() });

		expect(screen.getByText('How It Works Component')).toBeInTheDocument();
		expect(screen.getByText('Tiers Component')).toBeInTheDocument();
		expect(screen.getByText('FAQ Component')).toBeInTheDocument();
		expect(screen.getByText('Call To Action Component')).toBeInTheDocument();
	});
});
