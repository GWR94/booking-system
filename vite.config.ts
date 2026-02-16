import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	esbuild: {
		drop: mode === 'production' ? ['console', 'debugger'] : [],
	},
	base: '/',
	plugins: [react()],
	server: {
		port: 3000,
		host: true,
		open: true,
		proxy: {
			'/api': {
				target: 'http://localhost:4000',
				changeOrigin: true,
				secure: false,
			},
		},
		cors: true,
	},
	preview: {
		port: 3000,
		proxy: {
			'/api': {
				target: 'http://localhost:4000',
				changeOrigin: true,
				secure: false,
			},
		},
	},
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
			'src/': path.resolve(__dirname, './src') + '/',
			'next/server': path.resolve(
				__dirname,
				'./src/__test__/mocks/next-server.ts',
			),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.ts',
		css: true,
		reporters: ['verbose'],
		exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
		coverage: {
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*'],
			exclude: ['e2e/**'],
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'vendor-react': ['react', 'react-dom', 'react-router-dom'],
					'vendor-mui': ['@mui/material', '@mui/system'],
					'vendor-icons': ['@mui/icons-material'],
					'vendor-framer': ['framer-motion'],
					'vendor-utils': ['dayjs', 'axios'],
					'vendor-joi': ['joi'],
				},
			},
		},
	},
}));
