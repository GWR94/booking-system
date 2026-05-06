import Providers from './providers';
import { Footer, CookieConsentBanner, GoogleAnalytics, NavBar } from '@layout';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Suspense } from 'react';
import '../styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const metadata = {
	title: 'The Short Grass | TrackMan Golf Simulators',
	description:
		'Book your golf session at The Short Grass. Experience world-class golf simulators with TrackMan technology.',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body id="root">
				<AppRouterCacheProvider>
					<Providers>
						<Suspense fallback={null}>
							<GoogleAnalytics />
						</Suspense>
						<NavBar />
						<main>{children}</main>
						<Footer />
						<CookieConsentBanner />
					</Providers>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
};

export default RootLayout;
