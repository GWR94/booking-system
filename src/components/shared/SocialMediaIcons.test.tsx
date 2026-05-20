import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import SocialMediaIcons from './SocialMediaIcons';
import { ThemeProvider } from '@context';

const renderWithTheme = (ui: ReactElement) =>
	render(<ThemeProvider>{ui}</ThemeProvider>);

describe('SocialMediaIcons', () => {
	it('renders icon links in icons layout', () => {
		renderWithTheme(<SocialMediaIcons />);

		expect(screen.getByRole('link', { name: 'Facebook' })).toHaveAttribute(
			'href',
			expect.stringContaining('facebook.com'),
		);
		expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
			'href',
			expect.stringContaining('instagram.com'),
		);
		expect(
			screen.getByRole('link', { name: 'X (Formerly Twitter)' }),
		).toHaveAttribute('href', expect.stringContaining('x.com'));
	});

	it('renders follow copy and labelled buttons in block layout', () => {
		renderWithTheme(<SocialMediaIcons layout="block" />);

		expect(screen.getByText(/Follow us online/i)).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Facebook' })).toHaveAttribute(
			'href',
			expect.stringContaining('facebook.com'),
		);
		expect(
			screen.getByRole('link', { name: 'X (Formerly Twitter)' }),
		).toHaveAttribute('href', expect.stringContaining('x.com'));
	});
});
