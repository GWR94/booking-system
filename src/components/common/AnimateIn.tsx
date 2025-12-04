import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimateInProps {
	children: ReactNode;
	delay?: number;
	duration?: number;
	sx?: any;
}

const AnimateIn = ({ children, delay = 0, duration = 0.6 }: AnimateInProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-50px' }}
			transition={{
				duration: duration,
				delay: delay,
				ease: 'easeOut',
			}}
		>
			{children}
		</motion.div>
	);
};

export default AnimateIn;
