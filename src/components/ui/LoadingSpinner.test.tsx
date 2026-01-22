import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
	it('should render CircularProgress', () => {
		render(<LoadingSpinner />);
		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});

	it('should apply custom size', () => {
		render(<LoadingSpinner size={80} />);
		const spinner = screen.getByRole('progressbar');
		// Material UI sets size on the style object
		expect(spinner).toHaveStyle('width: 80px');
		expect(spinner).toHaveStyle('height: 80px');
	});
});
