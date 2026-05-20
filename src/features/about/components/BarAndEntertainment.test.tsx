import type { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import BarAndEntertainment from './BarAndEntertainment';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
	SectionHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
		<div>
			<span>{subtitle}</span>
			<h2>{title}</h2>
		</div>
	),
}));

describe('BarAndEntertainment', () => {
	const locationMock = { href: '' };

	beforeEach(() => {
		locationMock.href = '';
		vi.stubGlobal('location', locationMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('renders section header and feature copy', () => {
		render(
			<ThemeProvider>
				<BarAndEntertainment />
			</ThemeProvider>,
		);

		expect(screen.getByText('RELAX & RECHARGE')).toBeInTheDocument();
		expect(
			screen.getByRole('heading', {
				name: /Fully Licensed Bar & Entertainment/i,
			}),
		).toBeInTheDocument();
		expect(screen.getByText(/Premium Selection/i)).toBeInTheDocument();
		expect(screen.getByText(/Live Sports/i)).toBeInTheDocument();
	});

	it('renders bar image with alt text', () => {
		render(
			<ThemeProvider>
				<BarAndEntertainment />
			</ThemeProvider>,
		);
		expect(
			screen.getByRole('img', { name: /Bar and Lounge Area/i }),
		).toBeInTheDocument();
	});

	it('Make an Enquiry navigates to plan your visit on about', () => {
		render(
			<ThemeProvider>
				<BarAndEntertainment />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /Make an Enquiry/i }));
		expect(locationMock.href).toBe('/about#plan-your-visit');
	});
});
