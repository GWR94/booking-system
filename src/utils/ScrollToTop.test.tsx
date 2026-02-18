import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePathname } from 'next/navigation';
import { ScrollToTop } from './ScrollToTop';

vi.mock('next/navigation', () => ({
	usePathname: vi.fn(() => '/'),
}));

describe('ScrollToTop', () => {
	let scrollToMock: ReturnType<typeof vi.fn>;
	let rafCallback: FrameRequestCallback;
	let cancelAnimationFrameMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		scrollToMock = vi.fn();
		Object.defineProperty(window, 'scrollTo', { value: scrollToMock, writable: true });
		cancelAnimationFrameMock = vi.fn();
		vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
			rafCallback = cb;
			return 1;
		});
		vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrameMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('renders nothing', () => {
		const { container } = render(<ScrollToTop />);
		expect(container.firstChild).toBeNull();
	});

	it('scrolls to top on mount when pathname is set', () => {
		(usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/book');
		render(<ScrollToTop />);
		expect(rafCallback).toBeDefined();
		rafCallback(0);
		expect(scrollToMock).toHaveBeenCalledWith(0, 0);
	});

	it('cancels animation frame on unmount', () => {
		(usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/');
		const { unmount } = render(<ScrollToTop />);
		unmount();
		expect(cancelAnimationFrameMock).toHaveBeenCalledWith(1);
	});
});
