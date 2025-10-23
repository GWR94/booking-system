// src/App.tsx
import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/auth/Login';
import Booking from '../pages/Booking';
import RegisterUser from '../pages/RegisterUser';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../pages/NotFound';
import Landing from '../pages/Landing';
import NavBar from '../navigation/NavBar';
import Profile from '../pages/Profile';
import Checkout from '../components/booking/Checkout';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/common/Footer';
import PrivacyPolicy from '../components/policy/PrivacyPolicy';
import { Box } from '@mui/material';
import HelpCenter from '../components/policy/HelpCenter';
import Terms from '../components/policy/Terms';
import CookiesPolicy from '../components/policy/CookiesPolicy';
import Contact from '../pages/Contact';
import About from '../pages/About';
import Membership from '../pages/Membership';
import ScrollToTop from '../hooks/ScrollToTop';

const App: FC = () => {
	const { isAuthenticated } = useAuth();
	return (
		<Router>
			<Box sx={{ minHeight: '100vh' }}>
				<ScrollToTop />
				<NavBar />
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route
						path="/login"
						element={isAuthenticated ? <Landing /> : <Login />}
					/>
					<Route element={<ProtectedRoute />}>
						<Route path="/profile" element={<Profile />} />
						<Route path="/checkout/*" element={<Checkout />} />
					</Route>
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
