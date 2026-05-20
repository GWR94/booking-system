import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

/** Tests that need `document`, browser APIs, or @testing-library/react. */
const jsdomTestGlobs = [
	'src/components/**/*.test.{ts,tsx}',
	'src/features/**/*.test.{ts,tsx}',
	'src/app/**/*.test.{ts,tsx}',
	'src/hooks/**/*.test.{ts,tsx}',
	'src/context/**/*.test.{ts,tsx}',
	'src/api/**/*.test.{ts,tsx}',
	'src/utils/**/*.test.{ts,tsx}',
] as const;

/** UI-focused coverage: components, features, client context/hooks, and App Router UI (not API routes). */
const coverageInclude = [
	'src/components/**/*.{ts,tsx}',
	'src/features/**/*.{ts,tsx}',
	'src/context/**/*.{ts,tsx}',
	'src/hooks/**/*.{ts,tsx}',
	'src/app/**/*.{ts,tsx}',
] as const;

const coverageExclude = [
	'e2e/**',
	'**/index.ts',
	'src/server/db/client.ts',
	// Route shells: covered indirectly via feature tests / e2e; excluding avoids noisy 0% rows.
	'src/app/**/page.tsx',
	'src/app/**/layout.tsx',
	'src/app/providers.tsx',
	'src/app/not-found.tsx',
	'src/app/api/**',
	'**/*.test.{ts,tsx}',
	'**/*.spec.{ts,tsx}',
	'src/setupTests.tsx',
	'src/vitest-global-setup.ts',
	'src/__test__/**',
	'**/mocks/**',
	'**/*.d.ts',
	'**/types.ts',
	'src/types/**',
	'src/assets/**',
	'next-env.d.ts',
	'src/proxy.ts',
	'**/test-utils.tsx',
] as const;

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		globals: true,
		globalSetup: './src/vitest-global-setup.ts',
		setupFiles: './src/setupTests.tsx',
		css: false,
		reporters: ['default'],
		coverage: {
			provider: 'v8',
			include: [...coverageInclude],
			exclude: [...coverageExclude],
		},
		projects: [
			{
				extends: true,
				test: {
					name: 'jsdom',
					environment: 'jsdom',
					include: [...jsdomTestGlobs],
				},
			},
			{
				extends: true,
				test: {
					name: 'node',
					environment: 'node',
					include: ['src/**/*.test.{ts,tsx}'],
					exclude: [...jsdomTestGlobs],
				},
			},
		],
	},
});
