import { render, screen, waitFor } from '@testing-library/react';
import {
	describe,
	it,
	expect,
	vi,
	beforeAll,
	beforeEach,
	afterAll,
	afterEach,
} from 'vitest';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';

type AuthMock = {
	isAuthenticated: boolean;
	user: any;
	isLoading: boolean;
};

describe('App Integration', () => {

	beforeAll(async () => {
		vi.mock('framer-motion', () => ({
			motion: {
				div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
				span: ({ children, ...props }: any) => (
					<span {...props}>{children}</span>
				),
				header: ({ children, ...props }: any) => (
					<header {...props}>{children}</header>
				),
				img: ({ children, ...props }: any) => <img {...props} />,
				p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
				a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
			},
			AnimatePresence: ({ children }: any) => <>{children}</>,
			useScroll: () => ({
				scrollY: {
					get: () => 0,
					getPrevious: () => 0,
					on: () => {},
				},
			}),
			useMotionValueEvent: () => {},
			useTransform: () => 0,
			useSpring: () => 0,
			useInView: () => true,
			useAnimation: () => ({ start: () => {}, set: () => {} }),
		}));
	});

	beforeEach(async () => {
		vi.resetModules();
		vi.clearAllMocks();

		vi.mock('@hooks', () => ({
			useAuth: () => ({
				isAuthenticated: false,
				user: null,
				isLoading: false,
			}),
			useBasket: () => ({
				basket: [],
				basketPrice: '0.00',
				addToBasket: vi.fn(),
				removeFromBasket: vi.fn(),
				clearBasket: vi.fn(),
			}),
			useSession: () => ({
				slots: [],
				selectedDate: null,
			}),
			useSlots: () => ({
				slots: [],
				isLoading: false,
			}),
		}));
	});

	afterAll(async () => {
		vi.restoreAllMocks();
	});

	describe('#render', () => {
		it('should render the application and display key elements', async () => {

			render(
				<HelmetProvider>
					<App />
				</HelmetProvider>,
			);

			const heroText = await screen.findByRole('heading', {
				name: /Play. Practice. Perform./i,
			});
			expect(heroText).toBeInTheDocument();
		});

		it('should render the navigation bar', async () => {
			render(
				<HelmetProvider>
					<App />
				</HelmetProvider>,
			);

			// Assuming "Book Now" or similar exists in standard nav
			const homeLink = await screen.findByRole('banner');

			expect(homeLink).toBeInTheDocument();
		});
	});
});
