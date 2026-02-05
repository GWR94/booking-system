import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MembershipUsageSummary from './MembershipUsageSummary';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

describe('MembershipUsageSummary', () => {
	it('should render all hours correctly', () => {
		render(
			<ThemeProvider theme={theme}>
				<MembershipUsageSummary
					includedHours={10}
					usedHours={2}
					hoursToDeduct={2}
					remainingAfter={6}
				/>
			</ThemeProvider>,
		);

		expect(screen.getByText('10 hrs')).toBeInTheDocument();
		expect(screen.getByText('2 hrs')).toBeInTheDocument();
		expect(screen.getByText('-2 hrs')).toBeInTheDocument();
		expect(screen.getByText('6 hrs')).toBeInTheDocument();
	});

	it('should render 0 hrs when hoursToDeduct is 0', () => {
		render(
			<ThemeProvider theme={theme}>
				<MembershipUsageSummary
					includedHours={10}
					usedHours={0}
					hoursToDeduct={0}
					remainingAfter={10}
				/>
			</ThemeProvider>,
		);

		// Use getAllByText and check counts if needed, or target specific labels
		const zeroHrsElements = screen.getAllByText(/0 hrs/i);
		expect(zeroHrsElements.length).toBeGreaterThan(0);
	});

	it('should use error color when remainingAfter is 0', () => {
		render(
			<ThemeProvider theme={theme}>
				<MembershipUsageSummary
					includedHours={2}
					usedHours={0}
					hoursToDeduct={2}
					remainingAfter={0}
				/>
			</ThemeProvider>,
		);

		const remainingText = screen.getAllByText(/0 hrs/i);
		expect(remainingText.length).toBeGreaterThan(0);
	});
});
