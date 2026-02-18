import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import PrivacyPolicy from './PrivacyPolicy';
import createWrapper from '@utils/test-utils';

describe('PrivacyPolicy', () => {
	it('renders Privacy Policy heading', () => {
		render(<PrivacyPolicy />, { wrapper: createWrapper() });
		expect(screen.getByRole('heading', { name: /Privacy Policy/i })).toBeInTheDocument();
	});

	it('renders Last Updated date', () => {
		render(<PrivacyPolicy />, { wrapper: createWrapper() });
		expect(screen.getByText(/Last Updated:/)).toBeInTheDocument();
	});

	it('renders Introduction section', () => {
		render(<PrivacyPolicy />, { wrapper: createWrapper() });
		expect(screen.getByText(/1\. Introduction/)).toBeInTheDocument();
	});
});
