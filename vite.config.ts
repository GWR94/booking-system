import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

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
			'@common': '/src/components/common',
			'@components': '/src/components',
			'@hooks': '/src/hooks',
			'@context': '/src/context',
			'@assets': '/src/assets',
			'@pages': '/src/pages',
			'@utils': '/src/utils',
			'@api': '/src/api',
			'@layouts': '/src/layouts',
			'@ui': '/src/components/ui',
			'@layout': '/src/components/layout',
			'@shared': '/src/components/shared',
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
