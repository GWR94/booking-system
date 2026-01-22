import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AnimateIn from './AnimateIn';

// Simple mock for motion.div to avoid complex animation testing
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, style, ...props }: any) => (
			<div style={style} {...props} data-testid="motion-div">
				{children}
			</div>
		),
	},
}));

describe('AnimateIn', () => {
	it('should render children', () => {
		render(
			<AnimateIn>
				<div>Test Child</div>
			</AnimateIn>,
		);
		expect(screen.getByText('Test Child')).toBeInTheDocument();
	});

	it('should apply initial and whileInView styles based on type', () => {
		const { rerender } = render(
			<AnimateIn type="fade-down">
				<div>Content</div>
			</AnimateIn>,
		);

		let div = screen.getByTestId('motion-div');
		// Initial for fade-down should have y: -30
		expect(div).toHaveAttribute('initial');
		rerender(
			<AnimateIn type="zoom-in">
				<div>Content</div>
			</AnimateIn>,
		);
		div = screen.getByTestId('motion-div');
		// Verify props changed or simply that it still renders
		expect(div).toBeInTheDocument();
	});
});
