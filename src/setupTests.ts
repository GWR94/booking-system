import '@testing-library/jest-dom';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
	value: vi.fn(),
	writable: true,
});

// Mock ResizeObserver
class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock IntersectionObserver
class IntersectionObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}
window.IntersectionObserver = IntersectionObserver as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock Stripe
vi.mock('@stripe/react-stripe-js', () => ({
	Elements: ({ children }: any) => children,
	useStripe: () => ({
		createPaymentMethod: vi.fn(),
	}),
	useElements: () => ({
		getElement: vi.fn(),
	}),
}));

vi.mock('@stripe/stripe-js', () => ({
	loadStripe: vi.fn(() => Promise.resolve({})),
}));
