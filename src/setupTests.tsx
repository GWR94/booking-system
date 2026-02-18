import '@testing-library/jest-dom';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { createContext } from 'react';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Ensure coverage/.tmp exists so v8 reporter can write (avoids ENOENT)
try {
	const coverageTmp = join(process.cwd(), 'coverage', '.tmp');
	if (!existsSync(coverageTmp)) mkdirSync(coverageTmp, { recursive: true });
} catch {
	// ignore
}

dayjs.extend(advancedFormat);

// NextAuth auth.config requires AUTH_SECRET at load time
if (!process.env.AUTH_SECRET) {
	process.env.AUTH_SECRET = 'test-secret-for-unit-tests';
}

// Default @db mock so the real client (Prisma 7 adapter + DATABASE_URL) is never loaded in tests.
// Individual test files can override with their own vi.mock('@db', ...).
const createMockDelegate = () => ({
	findMany: vi.fn(),
	findUnique: vi.fn(),
	findFirst: vi.fn(),
	findFirstOrThrow: vi.fn(),
	findUniqueOrThrow: vi.fn(),
	create: vi.fn(),
	createMany: vi.fn(),
	update: vi.fn(),
	updateMany: vi.fn(),
	delete: vi.fn(),
	deleteMany: vi.fn(),
	upsert: vi.fn(),
	aggregate: vi.fn(),
	count: vi.fn(),
	groupBy: vi.fn(),
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

Object.defineProperty(window, 'scrollTo', {
	value: vi.fn(),
	writable: true,
});

class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}
window.ResizeObserver = ResizeObserver;

class IntersectionObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}
window.IntersectionObserver = IntersectionObserver as any;

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
		AnimatePresence: ({ children }: any) => <>{children}</>,
		motion: {
			...actual.motion,
			div: ({ children, ...props }: any) => (
				<div {...filterProps(props)}>{children}</div>
			),
			section: ({ children, ...props }: any) => (
				<section {...filterProps(props)}>{children}</section>
			),
			span: ({ children, ...props }: any) => (
				<span {...filterProps(props)}>{children}</span>
			),
			img: ({ children, ...props }: any) => (
				<img {...filterProps(props)}>{children}</img>
			),
			h1: ({ children, ...props }: any) => (
				<h1 {...filterProps(props)}>{children}</h1>
			),
			h2: ({ children, ...props }: any) => (
				<h2 {...filterProps(props)}>{children}</h2>
			),
			h3: ({ children, ...props }: any) => (
				<h3 {...filterProps(props)}>{children}</h3>
			),
			h4: ({ children, ...props }: any) => (
				<h4 {...filterProps(props)}>{children}</h4>
			),
			p: ({ children, ...props }: any) => (
				<p {...filterProps(props)}>{children}</p>
			),
			a: ({ children, ...props }: any) => (
				<a {...filterProps(props)}>{children}</a>
			),
			button: ({ children, ...props }: any) => (
				<button {...filterProps(props)}>{children}</button>
			),
			li: ({ children, ...props }: any) => (
				<li {...filterProps(props)}>{children}</li>
			),
			ul: ({ children, ...props }: any) => (
				<ul {...filterProps(props)}>{children}</ul>
			),
		},
	};
});

vi.mock('swiper/react', () => ({
	Swiper: ({ children }: any) => (
		<div data-testid="swiper-mock">{children}</div>
	),
	SwiperSlide: ({ children }: any) => (
		<div data-testid="swiper-slide-mock">{children}</div>
	),
}));

vi.mock('swiper/modules', () => ({
	Autoplay: () => null,
	Navigation: () => null,
	Pagination: () => null,
}));

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		refresh: vi.fn(),
	}),
	useSearchParams: () => ({
		get: vi.fn(),
		getAll: vi.fn(),
		has: vi.fn(),
		forEach: vi.fn(),
		entries: vi.fn(),
		keys: vi.fn(),
		values: vi.fn(),
		toString: vi.fn(),
	}),
	usePathname: () => '/',
	useSegments: () => [],
	useParams: () => ({}),
}));

vi.mock('next-auth/react', () => {
	const SessionContext = createContext({
		data: null,
		status: 'unauthenticated',
		update: vi.fn(),
	});

	const mockUseSession = vi.fn(() => ({
		data: null,
		status: 'unauthenticated',
		update: vi.fn(),
	}));

	return {
		SessionProvider: ({ children }: any) => (
			<SessionContext.Provider
				value={{
					data: null,
					status: 'unauthenticated',
					update: vi.fn(),
				}}
			>
				{children}
			</SessionContext.Provider>
		),
		useSession: mockUseSession,
		signIn: vi.fn(),
		signOut: vi.fn(),
		getCsrfToken: vi.fn(),
		getProviders: vi.fn(),
		getSession: vi.fn(),
	};
});
