import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Overview from './Overview';
import { ThemeProvider } from '@context';

vi.mock('./components', () => ({
	UserProfile: () => <div data-testid="user-profile">UserProfile</div>,
}));

vi.mock('@ui', () => ({
	SectionHeader: ({
		subtitle,
		title,
		description,
	}: {
		subtitle: string;
		title: string;
		description: string;
	}) => (
		<div data-testid="section-header">
			<span data-testid="subtitle">{subtitle}</span>
			<h2 data-testid="title">{title}</h2>
			<p data-testid="description">{description}</p>
		</div>
	),
}));

describe('Overview', () => {
	it('renders section header with profile overview content', () => {
		render(
			<ThemeProvider>
				<Overview />
			</ThemeProvider>,
		);

		expect(screen.getByTestId('section-header')).toBeInTheDocument();
		expect(screen.getByTestId('subtitle')).toHaveTextContent('PROFILE');
		expect(screen.getByTestId('title')).toHaveTextContent('Overview');
		expect(screen.getByTestId('description')).toHaveTextContent(
			'View and edit your personal information',
		);
	});

	it('renders UserProfile component', () => {
		render(
			<ThemeProvider>
				<Overview />
			</ThemeProvider>,
		);

		expect(screen.getByTestId('user-profile')).toBeInTheDocument();
		expect(screen.getByText('UserProfile')).toBeInTheDocument();
	});
});
