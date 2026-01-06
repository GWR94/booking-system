import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const GoogleAnalytics = () => {
	const location = useLocation();

	useEffect(() => {
		const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
		if (gaId && !ReactGA.isInitialized) {
			const savedConsent = localStorage.getItem('cookieConsent');
			const consentState = savedConsent === 'accepted' ? 'granted' : 'denied';

			ReactGA.gtag('consent', 'default', {
				ad_storage: consentState,
				ad_user_data: consentState,
				ad_personalization: consentState,
				analytics_storage: consentState,
			});

			ReactGA.initialize(gaId);
		}
	}, []);

	useEffect(() => {
		const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
		if (gaId) {
			ReactGA.send({
				hitType: 'pageview',
				page: location.pathname + location.search,
			});
		}
	}, [location]);

	return null;
};

export default GoogleAnalytics;
