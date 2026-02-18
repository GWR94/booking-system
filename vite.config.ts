import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vite config used only for Vitest; Next.js handles dev/build.
export default defineConfig(({ mode }) => ({
	esbuild: {
		drop: mode === 'production' ? ['console', 'debugger'] : [],
	},
	plugins: [react()],
	resolve: {
		alias: {
			'@auth': path.resolve(__dirname, './src/server/auth/auth'),
			'@db': path.resolve(__dirname, './src/server/db/client'),
			'@config': path.resolve(__dirname, './src/config'),
			'@lib': path.resolve(__dirname, './src/server/lib'),
			'@test': path.resolve(__dirname, './src/__test__'),
			'@constants': path.resolve(__dirname, './src/constants'),
			'@components': path.resolve(__dirname, './src/components'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@modules': path.resolve(__dirname, './src/server/modules'),
			'@context': path.resolve(__dirname, './src/context'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@features': path.resolve(__dirname, './src/features'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@api': path.resolve(__dirname, './src/api'),
			'@ui': path.resolve(__dirname, './src/components/ui'),
			'@layout': path.resolve(__dirname, './src/components/layout'),
			'@shared': path.resolve(__dirname, './src/components/shared'),
			'@styles': path.resolve(__dirname, './src/styles'),
			'@validation': path.resolve(__dirname, './src/validation'),
			'@': path.resolve(__dirname, './src'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.tsx',
		css: true,
		reporters: ['verbose'],
		exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
		coverage: {
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*'],
			exclude: [
				'e2e/**',
				'**/index.ts',
				'**/index.tsx',
				'src/server/db/client.ts',
			],
		},
	},
}));
