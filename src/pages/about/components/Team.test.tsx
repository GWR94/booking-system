import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Team from './Team';
import { ThemeProvider } from '@context';

describe('Team', () => {
	it('should render header and team section', () => {
		render(
			<ThemeProvider>
				<Team />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Meet Our Team/i)).toBeInTheDocument();
		expect(screen.getByText(/PGA-certified expertise/i)).toBeInTheDocument();
	});

	it('should render all team members', () => {
		render(
			<ThemeProvider>
				<Team />
			</ThemeProvider>,
		);

		expect(screen.getByText('Michael Wright')).toBeInTheDocument();
		expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
		expect(screen.getByText('David Chen')).toBeInTheDocument();
	});

	it('should render positions for team members', () => {
		render(
			<ThemeProvider>
				<Team />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Founder & Lead Instructor/i)).toBeInTheDocument();
		expect(screen.getByText(/Centre Manager/i)).toBeInTheDocument();
		expect(screen.getByText(/Senior PGA Coach/i)).toBeInTheDocument();
	});
});
