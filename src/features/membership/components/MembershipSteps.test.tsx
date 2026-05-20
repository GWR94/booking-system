import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MembershipSteps from './MembershipSteps';

vi.mock('@mui/material', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@mui/material')>();
	return {
		...actual,
		useMediaQuery: vi.fn(),
	};
});

const lightTheme = createTheme();
const darkTheme = createTheme({ palette: { mode: 'dark' } });

describe('MembershipSteps', () => {
	beforeEach(() => {
		vi.mocked(useMediaQuery).mockReturnValue(false);
	});

	it('renders mobile layout when below md', () => {
		render(
			<ThemeProvider theme={lightTheme}>
				<MembershipSteps />
			</ThemeProvider>,
		);

		expect(screen.getByLabelText(/Membership steps/i)).toBeInTheDocument();
		expect(screen.getByText('Choose your plan')).toBeInTheDocument();
		expect(screen.getByText('Stay on your terms')).toBeInTheDocument();
		expect(screen.getByText('Book and play')).toBeInTheDocument();
	});

	it('renders desktop layout when md and up', () => {
		vi.mocked(useMediaQuery).mockReturnValue(true);
		render(
			<ThemeProvider theme={lightTheme}>
				<MembershipSteps />
			</ThemeProvider>,
		);

		expect(screen.getByLabelText(/Membership steps/i)).toBeInTheDocument();
		expect(screen.getAllByText('Choose your plan').length).toBeGreaterThan(0);
	});

	it('uses dark palette branch for step circles', () => {
		vi.mocked(useMediaQuery).mockReturnValue(false);
		render(
			<ThemeProvider theme={darkTheme}>
				<MembershipSteps />
			</ThemeProvider>,
		);
		expect(screen.getByLabelText(/Membership steps/i)).toBeInTheDocument();
	});
});
