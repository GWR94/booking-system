import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Contact from './Contact';

vi.mock('@shared', () => ({
	ContactForm: () => <div>Contact Form Component</div>,
}));

vi.mock('@ui', () => ({
	SectionHeader: ({
		title,
		subtitle,
		description,
	}: {
		title: string;
		subtitle?: string;
		description?: string;
	}) => (
		<div>
			{subtitle && <span data-testid="section-subtitle">{subtitle}</span>}
			<h2>{title}</h2>
			{description && <p>{description}</p>}
		</div>
	),
}));

import createWrapper from '@utils/test-utils';

describe('Contact Page', () => {
	it('renders Contact Us heading', () => {
		render(<Contact />, { wrapper: createWrapper() });

		expect(
			screen.getByRole('heading', { name: /Contact Us/i }),
		).toBeInTheDocument();
	});

	it('renders subtitle about golf simulator facilities', () => {
		render(<Contact />, { wrapper: createWrapper() });

		expect(
			screen.getByText(/We're here to help with any questions/i),
		).toBeInTheDocument();
	});

	it('renders ContactForm component', () => {
		render(<Contact />, { wrapper: createWrapper() });

		expect(screen.getByText('Contact Form Component')).toBeInTheDocument();
	});

	it('renders location section heading', () => {
		render(<Contact />, { wrapper: createWrapper() });

		expect(
			screen.getByRole('heading', { name: /Find Our Location/i }),
		).toBeInTheDocument();
	});

	it('renders Google Maps iframe', () => {
		render(<Contact />, { wrapper: createWrapper() });

		const iframe = screen.getByTitle('The Short Grass Location');
		expect(iframe).toBeInTheDocument();
		expect(iframe).toHaveAttribute('src');
		expect(iframe.getAttribute('src')).toContain('google.com/maps');
	});

	it('renders location information sections', () => {
		render(<Contact />, { wrapper: createWrapper() });

		expect(screen.getByText('Getting Here')).toBeInTheDocument();
		expect(screen.getByText('Public Transport')).toBeInTheDocument();
		expect(
			screen.getByText(/Located in the heart of Maidstone Town Centre/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Free parking available for all customers/i),
		).toBeInTheDocument();
	});

	it('renders transport information', () => {
		render(<Contact />, { wrapper: createWrapper() });

		expect(screen.getByText(/Bus Routes: 14, 36, 42/i)).toBeInTheDocument();
		expect(
			screen.getByText(/Train: Maidstone East or Maidstone West/i),
		).toBeInTheDocument();
	});
});
