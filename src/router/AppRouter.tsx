import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '@hooks';
import GoogleAnalytics from '../components/layout/GoogleAnalytics';
import CookieConsentBanner from '../components/layout/CookieConsentBanner';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Box } from '@mui/material';
// MainLayout is eager for landing page
import MainLayout from '../layouts/MainLayout';
import { ScrollToTop } from '@utils';
import AdminRoute from './AdminRoute';

// Landing is eagerly loaded for speed
import Landing from '../pages/landing/Landing';

// Lazy load layouts to reduce initial bundle size
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));
const ProfileLayout = lazy(() => import('../layouts/ProfileLayout'));

// All other pages are lazily loaded
const About = lazy(() => import('../pages/about/About'));
const Membership = lazy(() => import('../pages/membership/Membership'));
const NotFound = lazy(() => import('../pages/not-found/NotFound'));
const RegisterUser = lazy(() => import('../pages/auth/RegisterUser'));
const Checkout = lazy(() => import('../pages/checkout/Checkout'));
const Login = lazy(() => import('../pages/auth/Login'));
const Booking = lazy(() => import('../pages/booking/Booking'));
const Contact = lazy(() => import('../pages/contact/Contact'));
const Terms = lazy(() => import('../pages/legal/Terms'));
const PrivacyPolicy = lazy(() => import('../pages/legal/PrivacyPolicy'));
const HelpCenter = lazy(() => import('../pages/help-center/HelpCenter'));
const CookiesPolicy = lazy(() => import('../pages/legal/CookiesPolicy'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminBookings = lazy(() => import('../pages/admin/AdminBookings'));
const AdminBlockOuts = lazy(() => import('../pages/admin/AdminBlockOuts'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const Overview = lazy(() => import('../pages/profile/Overview'));
const MyBookings = lazy(() => import('../pages/profile/MyBookings'));
const Settings = lazy(() => import('../pages/profile/Settings'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

const PageLoader = () => (
	<Box
		sx={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100vh',
		}}
	>
		<LoadingSpinner />
	</Box>
);

const AppRouter = () => {
	const { isAuthenticated } = useAuth();

	return (
		<Box sx={{ minHeight: '100vh' }}>
			<ScrollToTop />
			<GoogleAnalytics />
			<CookieConsentBanner />
			<Suspense fallback={<PageLoader />}>
				<Routes>
					{/* Public Routes with MainLayout */}
					<Route element={<MainLayout />}>
						<Route path="/" element={<Landing />} />
						<Route path="/checkout/*" element={<Checkout />} />
						<Route path="/privacy" element={<PrivacyPolicy />} />
						<Route path="/help" element={<HelpCenter />} />
						<Route path="/book" element={<Booking />} />
						<Route path="/terms" element={<Terms />} />
						<Route path="/cookies" element={<CookiesPolicy />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/about" element={<About />} />
						<Route path="/membership" element={<Membership />} />
						<Route path="*" element={<NotFound />} />
					</Route>

					{/* Auth Routes */}
					<Route element={<AuthLayout />}>
						<Route
							path="/login"
							element={isAuthenticated ? <Landing /> : <Login />}
						/>
						<Route path="/register" element={<RegisterUser />} />
						<Route path="/reset-password" element={<ResetPassword />} />
					</Route>

					{/* Profile Routes */}
					<Route element={<ProtectedRoute />}>
						<Route element={<ProfileLayout />}>
							<Route
								path="/profile"
								element={<Navigate to="/profile/overview" replace />}
							/>
							<Route path="/profile/overview" element={<Overview />} />
							<Route path="/profile/bookings" element={<MyBookings />} />
							<Route path="/profile/settings" element={<Settings />} />
						</Route>
					</Route>

					{/* Admin Routes */}
					<Route element={<AdminRoute />}>
						<Route path="/admin" element={<AdminLayout />}>
							<Route index element={<Navigate to="dashboard" replace />} />
							<Route path="dashboard" element={<AdminDashboard />} />
							<Route path="bookings" element={<AdminBookings />} />
							<Route path="users" element={<AdminUsers />} />
							<Route path="block-outs" element={<AdminBlockOuts />} />
						</Route>
					</Route>
				</Routes>
			</Suspense>
		</Box>
	);
};

export default AppRouter;
