import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '@hooks';
import { Footer, NavBar, GoogleAnalytics, CookieConsentBanner } from '@common';
import { Box } from '@mui/material';
import {
	About,
	Membership,
	NotFound,
	RegisterUser,
	Checkout,
	Landing,
	Login,
	Profile,
	Booking,
	Contact,
	Terms,
	PrivacyPolicy,
	HelpCenter,
	CookiesPolicy,
} from '@pages';
import ScrollToTop from '@utils/ScrollToTop';

const App = () => {
	const { isAuthenticated } = useAuth();

	return (
		<Router>
			<Box
				sx={{
					minHeight: '100vh',
					// bgcolor: alpha(theme.palette.primary.main, 0.1),
				}}
			>
				<ScrollToTop />
				<GoogleAnalytics />
				<CookieConsentBanner />
				<NavBar />
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route
						path="/login"
						element={isAuthenticated ? <Landing /> : <Login />}
					/>
					<Route element={<ProtectedRoute />}>
						<Route path="/profile" element={<Profile />} />
					</Route>
					<Route path="/checkout/*" element={<Checkout />} />
					<Route path="/privacy" element={<PrivacyPolicy />} />
					<Route path="/help" element={<HelpCenter />} />
					<Route path="/book" element={<Booking />} />
					<Route path="/register" element={<RegisterUser />} />
					<Route path="/terms" element={<Terms />} />
					<Route path="/cookies" element={<CookiesPolicy />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/about" element={<About />} />
					<Route path="/membership" element={<Membership />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Box>
			<Footer />
		</Router>
	);
};

export default App;
