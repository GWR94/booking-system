import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
	base: '/',
	plugins: [react()],
	server: {
		port: 3000,
		host: true, // Listen on all local IPs
		open: true, // Open browser on start
		proxy: {
			'/api': {
				target: 'http://localhost:4000',
				changeOrigin: true,
				secure: false,
			},
		},
		cors: true,
		// https: true, // Enable if needed
	},
	resolve: {
		alias: {
			'@common': '/src/components/common',
			'@components': '/src/components',
			'@hooks': '/src/hooks',
			'@context': '/src/context',
			'@assets': '/src/assets',
			'@pages': '/src/pages',
			'@utils': '/src/utils',
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.ts',
		css: true,
		reporters: ['verbose'],
		coverage: {
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*'],
			exclude: [],
		},
	},
});
