import { describe, it, expect, afterEach } from 'vitest';
import {
	getPublicSiteUrl,
	getEmailSiteUrl,
	getEmailLogoUrl,
	normalizeSiteUrl,
	resolveSiteOrigin,
} from './site-url';

describe('site-url', () => {
	const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
	const originalEmailSiteUrl = process.env.EMAIL_SITE_URL;
	const originalLogoUrl = process.env.LOGO_URL;

	afterEach(() => {
		process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
		process.env.EMAIL_SITE_URL = originalEmailSiteUrl;
		process.env.LOGO_URL = originalLogoUrl;
	});

	it('normalizeSiteUrl strips trailing slash', () => {
		expect(normalizeSiteUrl('https://a.com/')).toBe('https://a.com');
		expect(normalizeSiteUrl('https://a.com')).toBe('https://a.com');
	});

	it('resolveSiteOrigin adds https for bare domains', () => {
		expect(resolveSiteOrigin('example.com')).toBe('https://example.com');
		expect(resolveSiteOrigin('http://localhost:3000')).toBe(
			'http://localhost:3000',
		);
	});

	it('getPublicSiteUrl reads NEXT_PUBLIC_APP_URL', () => {
		process.env.NEXT_PUBLIC_APP_URL = 'https://prod.example/';
		expect(getPublicSiteUrl()).toBe('https://prod.example');
	});

	it('getPublicSiteUrl falls back when env is missing outside production', () => {
		delete process.env.NEXT_PUBLIC_APP_URL;
		const prevNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'test';
		expect(getPublicSiteUrl()).toBe('http://localhost:3000');
		process.env.NODE_ENV = prevNodeEnv;
	});

	it('getEmailSiteUrl prefers EMAIL_SITE_URL over NEXT_PUBLIC_APP_URL', () => {
		process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
		process.env.EMAIL_SITE_URL = 'https://live.example.com';
		expect(getEmailSiteUrl()).toBe('https://live.example.com');
	});

	it('getEmailLogoUrl uses absolute LOGO_URL or site logo path', () => {
		delete process.env.LOGO_URL;
		const site = 'https://live.example.com';
		expect(getEmailLogoUrl(site)).toBe('https://live.example.com/logo.webp');
		process.env.LOGO_URL = 'https://cdn.example.com/logo.png';
		expect(getEmailLogoUrl(site)).toBe('https://cdn.example.com/logo.png');
	});
});
