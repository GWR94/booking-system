import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SectionHeader from './SectionHeader';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

// Mock AnimateIn
vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

describe('SectionHeader', () => {
	it('should render title', () => {
		render(
			<ThemeProvider theme={theme}>
				<SectionHeader title="Test Title" />
			</ThemeProvider>,
		);

		expect(screen.getByText('Test Title')).toBeInTheDocument();
	});

	it('should render subtitle and description when provided', () => {
		render(
			<ThemeProvider theme={theme}>
				<SectionHeader
					title="Test Title"
					subtitle="Test Subtitle"
					description="Test Description"
				/>
			</ThemeProvider>,
		);

		expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
		expect(screen.getByText('Test Description')).toBeInTheDocument();
	});

	it('should cover all color variants', () => {
		const colors: Array<'primary' | 'secondary' | 'white'> = [
			'primary',
			'secondary',
			'white',
		];

		colors.forEach((variant) => {
			const { unmount } = render(
				<ThemeProvider theme={theme}>
					<SectionHeader title="Title" color={variant} subtitle="Subtitle" />
				</ThemeProvider>,
			);
			expect(screen.getByText('Title')).toBeInTheDocument();
			unmount();
		});
	});
});
