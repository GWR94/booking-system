import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		// Decouple scroll from the render cycle to avoid forced reflows
		const scrollRaf = requestAnimationFrame(() => {
			window.scrollTo(0, 0);
		});
		return () => cancelAnimationFrame(scrollRaf);
	}, [pathname]);

	return null; // This component doesn't render anything
};

export default ScrollToTop;
