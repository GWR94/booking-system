import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Terms from './Terms';
import createWrapper from '@utils/test-utils';

describe('Terms', () => {
	it('renders Terms and Conditions heading', () => {
		render(<Terms />, { wrapper: createWrapper() });
		expect(screen.getByRole('heading', { name: /Terms and Conditions/i })).toBeInTheDocument();
	});

	it('renders Last Updated date', () => {
		render(<Terms />, { wrapper: createWrapper() });
		expect(screen.getByText(/Last Updated:/)).toBeInTheDocument();
	});

	it('renders Agreement to Terms section', () => {
		render(<Terms />, { wrapper: createWrapper() });
		expect(screen.getByText(/1\. Agreement to Terms/)).toBeInTheDocument();
	});
});
