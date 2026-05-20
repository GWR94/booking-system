import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MembershipFAQ from './MembershipFAQ';
import { ThemeProvider } from '@context';
import { supportFaqsHref } from '@features/help-center/supportSections';

vi.mock('next/link', () => ({
	default: ({
		children,
		href,
	}: {
		children: React.ReactNode;
		href: string;
	}) => <a href={href}>{children}</a>,
}));

describe('MembershipFAQ', () => {
	it('links to membership FAQs on the help hub', () => {
		render(
			<ThemeProvider>
				<MembershipFAQ />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Membership questions\?/i)).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /View membership FAQs/i })).toHaveAttribute(
			'href',
			supportFaqsHref('membership'),
		);
	});
});
