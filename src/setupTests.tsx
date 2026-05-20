import '@testing-library/jest-dom';
import { vi } from 'vitest';
import type { VitestNextRouterMocks } from './__test__/vitest-next-router';

const nextRouterMocks = vi.hoisted(() => ({
	push: vi.fn(),
	replace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: nextRouterMocks.push,
		replace: nextRouterMocks.replace,
	}),
	useSearchParams: () => ({ get: vi.fn() }),
	usePathname: () => '/',
}));

(
	globalThis as typeof globalThis & {
		__vitestNextRouter?: VitestNextRouterMocks;
	}
).__vitestNextRouter = nextRouterMocks;
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

// Auth & Env
process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'test-secret';

// Lighter Framer Motion Mock (No more await importOriginal!)
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
		section: ({ children, ...props }: any) => (
			<section {...props}>{children}</section>
		),
		span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
		img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
		h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
		button: ({ children, ...props }: any) => (
			<button {...props}>{children}</button>
		),
		// Add others if your tests fail specifically for them, but keep it minimal
	},
	AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Lighter DB Mock
const createMockDelegate = () => ({
	findMany: vi.fn(),
	findUnique: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	delete: vi.fn(),
	count: vi.fn(),
});

vi.mock('@db', () => ({
	db: {
		user: createMockDelegate(),
		bay: createMockDelegate(),
		slot: createMockDelegate(),
		booking: createMockDelegate(),
		$disconnect: vi.fn(),
	},
}));

// Window & UI Stubs (skip in node-only tests — e.g. src/auth.config.test.ts)
if (typeof window !== 'undefined') {
	Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
	window.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
	window.IntersectionObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	} as any;
}

vi.mock('next-auth/react', () => ({
	SessionProvider: ({ children }: any) => <>{children}</>,
	useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
	signIn: vi.fn(),
	signOut: vi.fn(),
}));
