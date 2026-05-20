import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Membership from './Membership';

vi.mock('./components/HowItWorks', () => ({
	default: () => <div>How It Works Component</div>,
}));
vi.mock('./components/PurchaseTiers', () => ({
	default: () => <div>Purchase Tiers Component</div>,
}));
vi.mock('./components/MembershipSteps', () => ({
	default: () => <div>Membership Steps Component</div>,
}));
vi.mock('./components/MembershipFAQ', () => ({
	default: () => <div>FAQ Component</div>,
}));
vi.mock('./components/CallToAction', () => ({
	default: () => <div>Call To Action Component</div>,
}));

import createWrapper from '@utils/test-utils';

describe('Membership Page', () => {
	it('renders Membership Plans heading', async () => {
		render(<Membership />, { wrapper: createWrapper() });

		expect(
			screen.getByRole('heading', { name: /Membership Plans/i }),
		).toBeInTheDocument();
		await screen.findByText('How It Works Component');
	});

	it('renders subtitle about membership benefits', async () => {
		render(<Membership />, { wrapper: createWrapper() });

		expect(
			screen.getByText(/Choose the perfect membership plan/i),
		).toBeInTheDocument();
		await screen.findByText('How It Works Component');
	});

	it('renders lazy membership sections after load', async () => {
		render(<Membership />, { wrapper: createWrapper() });

		await waitFor(() => {
			expect(screen.getByText('How It Works Component')).toBeInTheDocument();
		});
		expect(screen.getByText('Purchase Tiers Component')).toBeInTheDocument();
		expect(screen.getByText('Membership Steps Component')).toBeInTheDocument();
		expect(screen.getByText('FAQ Component')).toBeInTheDocument();
		expect(screen.getByText('Call To Action Component')).toBeInTheDocument();
	});
});
