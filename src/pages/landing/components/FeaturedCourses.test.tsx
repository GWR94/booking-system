import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import FeaturedCourses from './FeaturedCourses';
import { ThemeProvider } from '@context';

describe('FeaturedCourses', () => {
	it('should render main headings', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<FeaturedCourses />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText(/World Famous Venues/i)).toBeInTheDocument();
		expect(
			screen.getByText(/Experience world-class golf courses/i),
		).toBeInTheDocument();
	});

	it('should render all featured courses', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<FeaturedCourses />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText(/St. Andrews Links/i)).toBeInTheDocument();
		expect(screen.getByText(/Pebble Beach/i)).toBeInTheDocument();
		expect(screen.getByText(/Royal County Down/i)).toBeInTheDocument();
	});

	it('should render locations for courses', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<FeaturedCourses />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText(/Scotland, UK/i)).toBeInTheDocument();
		expect(screen.getByText(/California, USA/i)).toBeInTheDocument();
		expect(screen.getByText(/Northern Ireland/i)).toBeInTheDocument();
	});
});
