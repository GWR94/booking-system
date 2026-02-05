import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CheckoutSkeleton from './CheckoutSkeleton';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

describe('CheckoutSkeleton', () => {
	it('should render all skeleton sections', () => {
		const { container } = render(
			<ThemeProvider theme={theme}>
				<CheckoutSkeleton />
			</ThemeProvider>,
		);

		const skeletons = container.querySelectorAll('.MuiSkeleton-root');
		expect(skeletons.length).toBeGreaterThan(10);
	});
});
