'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';
import { useCookie } from '@context';

declare global {
	interface Window {
		gtag: (
			command: 'consent' | 'config' | 'event' | 'js',
			targetId: string,
			config?: Record<string, any>,
		) => void;
	}
}

const GoogleAnalytics = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { preferences } = useCookie();
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

		// Map our internal state to GA consent strings
		const consentState = preferences.analytics ? 'granted' : 'denied';

		if (window.gtag) {
			window.gtag('consent', 'update', {
				ad_storage: consentState,
				ad_user_data: consentState,
				ad_personalization: consentState,
				analytics_storage: consentState,
			});
		}

		// Only initialize if we have explicit analytics consent and an ID
		if (
			gaId &&
			preferences.analytics &&
			!initialized &&
			!ReactGA.isInitialized
		) {
			ReactGA.initialize(gaId);
			setInitialized(true);
		}
	}, [preferences.analytics, initialized]);

	useEffect(() => {
		// Only track page views if analytics allowed
		if (initialized && preferences.analytics) {
			ReactGA.send({
				hitType: 'pageview',
				page:
					pathname +
					(searchParams?.toString() ? `?${searchParams.toString()}` : ''),
			});
		}
	}, [pathname, searchParams, initialized, preferences.analytics]);

	return null;
};

export default GoogleAnalytics;
