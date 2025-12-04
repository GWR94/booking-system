/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BACKEND_API: string;
	readonly VITE_STRIPE_PUBLIC_KEY: string;
	readonly VITE_API_URL: string;
	readonly NODE_ENV: 'development' | 'production';
	readonly VITE_CAPTCHA_SITE_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

// Asset modules
declare module '*.svg' {
	import React = require('react');
	export const ReactComponent: React.FunctionComponent<
		React.SVGProps<SVGSVGElement>
	>;
	const src: string;
	export default src;
}

declare module '*.png' {
	const content: string;
	export default content;
}

declare module '*.jpg' {
	const content: string;
	export default content;
}
