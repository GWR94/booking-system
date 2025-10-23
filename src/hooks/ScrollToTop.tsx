import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		// Scroll to the top of the page whenever the route changes
		window.scrollTo({
			top: 0,
			// behavior: 'smooth', // smooth scrolling
		});
	}, [pathname]);

	return null; // This component doesn't render anything
};

export default ScrollToTop;
