'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ScrollToTop = () => {
	const pathname = usePathname();

	useEffect(() => {
		// Decouple scroll from the render cycle to avoid forced reflows
		const scrollRaf = requestAnimationFrame(() => {
			window.scrollTo(0, 0);
		});
		return () => cancelAnimationFrame(scrollRaf);
	}, [pathname]);

	return null; // This component doesn't render anything
};

export { ScrollToTop };
export default ScrollToTop;
