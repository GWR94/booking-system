import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AnimateIn from './AnimateIn';

describe('AnimateIn', () => {
	it('should render children', () => {
		render(
			<AnimateIn>
				<div data-testid="test-child">Child</div>
			</AnimateIn>,
		);

		expect(screen.getByTestId('test-child')).toBeInTheDocument();
	});

	it('should cover all animation types', () => {
		const types: Array<
			| 'fade-up'
			| 'fade-down'
			| 'fade-left'
			| 'fade-right'
			| 'zoom-in'
			| 'zoom-out'
		> = [
			'fade-up',
			'fade-down',
			'fade-left',
			'fade-right',
			'zoom-in',
			'zoom-out',
		];

		types.forEach((type) => {
			const { unmount } = render(
				<AnimateIn type={type}>
					<div>{type}</div>
				</AnimateIn>,
			);
			expect(screen.getByText(type)).toBeInTheDocument();
			unmount();
		});
	});
});
