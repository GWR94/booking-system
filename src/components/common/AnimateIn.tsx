import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimateInProps {
	children: ReactNode;
	delay?: number;
	duration?: number;
	style?: React.CSSProperties;
	animation?: 'easeOut' | 'easeIn' | 'easeInOut' | 'linear';
	type?:
		| 'fade-up'
		| 'fade-down'
		| 'fade-left'
		| 'fade-right'
		| 'zoom-in'
		| 'zoom-out';
	repeat?: boolean;
}

const AnimateIn = ({
	children,
	delay = 0,
	duration = 0.6,
	animation = 'easeOut',
	type = 'fade-up',
	repeat = false,
	style,
}: AnimateInProps) => {
	const getVariants = (type: string) => {
		switch (type) {
			case 'fade-down':
				return {
					initial: { opacity: 0, y: -30 },
					whileInView: { opacity: 1, y: 0 },
				};
			case 'fade-left':
				return {
					initial: { opacity: 0, x: 30 },
					whileInView: { opacity: 1, x: 0 },
				};
			case 'fade-right':
				return {
					initial: { opacity: 0, x: -30 },
					whileInView: { opacity: 1, x: 0 },
				};
			case 'zoom-in':
				return {
					initial: { opacity: 0, scale: 0.9 },
					whileInView: { opacity: 1, scale: 1 },
				};
			case 'zoom-out':
				return {
					initial: { opacity: 0, scale: 1.1 },
					whileInView: { opacity: 1, scale: 1 },
				};
			case 'fade-up':
			default:
				return {
					initial: { opacity: 0, y: 30 },
					whileInView: { opacity: 1, y: 0 },
				};
		}
	};

	const variants = getVariants(type);

	return (
		<motion.div
			initial={variants.initial}
			whileInView={variants.whileInView}
			viewport={{ once: !repeat, margin: '-50px' }}
			transition={{
				duration: duration,
				delay: delay,
				ease: animation,
			}}
			style={style}
		>
			{children}
		</motion.div>
	);
};

export default AnimateIn;
