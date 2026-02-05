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

vi.mock('framer-motion', async (importOriginal) => {
	const actual = await importOriginal<typeof import('framer-motion')>();
	const React = require('react');

	// Helper to filter out motion-specific props
	const filterProps = (props: any) => {
		const {
			initial,
			animate,
			exit,
			transition,
			variants,
			whileInView,
			whileHover,
			whileTap,
			whileDrag,
			whileFocus,
			viewport,
			...validProps
		} = props;
		return validProps;
	};

	return {
		...actual,
		AnimatePresence: ({ children }: any) =>
			React.createElement(React.Fragment, null, children),
		motion: {
			...actual.motion,
			div: ({ children, ...props }: any) =>
				React.createElement('div', filterProps(props), children),
			section: ({ children, ...props }: any) =>
				React.createElement('section', filterProps(props), children),
			span: ({ children, ...props }: any) =>
				React.createElement('span', filterProps(props), children),
			img: ({ children, ...props }: any) =>
				React.createElement('img', filterProps(props), children),
			h1: ({ children, ...props }: any) =>
				React.createElement('h1', filterProps(props), children),
			h2: ({ children, ...props }: any) =>
				React.createElement('h2', filterProps(props), children),
			h3: ({ children, ...props }: any) =>
				React.createElement('h3', filterProps(props), children),
			h4: ({ children, ...props }: any) =>
				React.createElement('h4', filterProps(props), children),
			p: ({ children, ...props }: any) =>
				React.createElement('p', filterProps(props), children),
			a: ({ children, ...props }: any) =>
				React.createElement('a', filterProps(props), children),
			button: ({ children, ...props }: any) =>
				React.createElement('button', filterProps(props), children),
			li: ({ children, ...props }: any) =>
				React.createElement('li', filterProps(props), children),
			ul: ({ children, ...props }: any) =>
				React.createElement('ul', filterProps(props), children),
		},
	};
});

// Mock Swiper
vi.mock('swiper/react', () => {
	const React = require('react');
	return {
		Swiper: ({ children }: any) =>
			React.createElement('div', { 'data-testid': 'swiper-mock' }, children),
		SwiperSlide: ({ children }: any) =>
			React.createElement(
				'div',
				{ 'data-testid': 'swiper-slide-mock' },
				children,
			),
	};
});

vi.mock('swiper/modules', () => ({
	Autoplay: () => null,
	Navigation: () => null,
	Pagination: () => null,
}));
