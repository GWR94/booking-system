import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SupportHub from './SupportHub';
import createWrapper from '@utils/test-utils';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
	useRouter: () => ({ push: pushMock }),
	useSearchParams: () => new URLSearchParams('section=terms'),
}));

vi.mock('./HelpCenter', () => ({
	default: () => <div data-testid="help-faqs">FAQs</div>,
}));

vi.mock('@features/legal/Terms', () => ({
	default: () => <div data-testid="terms">Terms</div>,
}));

vi.mock('@features/legal/PrivacyPolicy', () => ({
	default: () => <div data-testid="privacy">Privacy</div>,
}));

vi.mock('@features/legal/CookiesPolicy', () => ({
	default: () => <div data-testid="cookies">Cookies</div>,
}));

describe('SupportHub', () => {
	beforeEach(() => {
		pushMock.mockClear();
	});

	it('renders section tabs and the active legal panel from the URL', () => {
		render(<SupportHub />, { wrapper: createWrapper() });

		expect(screen.getByRole('tab', { name: 'Terms' })).toBeInTheDocument();
		expect(screen.getByTestId('terms')).toBeInTheDocument();
		expect(screen.queryByTestId('help-faqs')).not.toBeInTheDocument();
	});
});
