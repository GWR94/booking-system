import { Box, useTheme } from '@mui/material';
import { useMemo } from 'react';

interface AbstractBackgroundProps {
	primaryColor?: string;
	secondaryColor?: string;
	accentColor?: string;
	opacity?: number;
}

const AbstractBackground: React.FC<AbstractBackgroundProps> = ({
	primaryColor,
	secondaryColor,
	accentColor,
	opacity = 0.05,
}) => {
	const theme = useTheme();

	// Use provided colors or default to theme colors
	const primary = primaryColor || theme.palette.primary.main;
	const secondary = secondaryColor || theme.palette.secondary.main;
	const accent = accentColor || theme.palette.accent?.main || '#FFB74D';

	// Fixed positions for dots to avoid Math.random() in render
	const dots = useMemo(
		() =>
			[...Array(20)].map(() => ({
				x: Math.random() * 100,
				y: Math.random() * 100,
				r: Math.random() * 4 + 1,
				opacity: Math.random() * 0.5 + 0.1,
			})),
		[],
	);

	return (
		<Box
			sx={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 0,
				opacity: opacity,
				pointerEvents: 'none',
				willChange: 'opacity', // Hint to browser
			}}
		>
			<svg
				width="100%"
				height="100%"
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<pattern
						id="smallGrid"
						width="20"
						height="20"
						patternUnits="userSpaceOnUse"
					>
						<path
							d="M 20 0 L 0 0 0 20"
							fill="none"
							stroke={primary}
							strokeWidth="0.5"
							opacity="0.3"
						/>
					</pattern>

					<pattern
						id="grid"
						width="100"
						height="100"
						patternUnits="userSpaceOnUse"
					>
						<rect width="100" height="100" fill="url(#smallGrid)" />
						<path
							d="M 100 0 L 0 0 0 100"
							fill="none"
							stroke={primary}
							strokeWidth="1"
							opacity="0.5"
						/>
					</pattern>

					<linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor={primary} stopOpacity="0.2" />
						<stop offset="100%" stopColor={secondary} stopOpacity="0.1" />
					</linearGradient>

					{/* Simplified filter for better performance */}
					<filter id="glow">
						<feGaussianBlur stdDeviation="4" result="blur" />
						<feMerge>
							<feMergeNode in="blur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{/* Background grid */}
				<rect width="100%" height="100%" fill="url(#grid)" />

				{/* Large flowing shapes */}
				<path
					d="M-100,250 C150,50 350,50 500,250 C650,450 850,450 1000,250 L1000,750 L-100,750 Z"
					fill="url(#gradient1)"
					transform="rotate(-5)"
				/>

				{/* Abstract circles */}
				<circle cx="15%" cy="20%" r="120" fill={primary} opacity="0.05" />
				<circle cx="85%" cy="75%" r="150" fill={secondary} opacity="0.07" />

				{/* Golf-themed decorative elements */}
				<circle
					cx="25%"
					cy="65%"
					r="8"
					fill={accent}
					opacity="0.6"
					filter="url(#glow)"
				/>
				<circle
					cx="75%"
					cy="30%"
					r="6"
					fill={accent}
					opacity="0.6"
					filter="url(#glow)"
				/>
				<circle
					cx="50%"
					cy="85%"
					r="10"
					fill={accent}
					opacity="0.6"
					filter="url(#glow)"
				/>

				{/* Abstract lines */}
				<path
					d="M200,100 C300,200 400,100 500,200 C600,300 700,200 800,300"
					stroke={primary}
					strokeWidth="1.5"
					fill="none"
					opacity="0.2"
				/>
				<path
					d="M100,300 C200,400 300,300 400,400 C500,500 600,400 700,500"
					stroke={secondary}
					strokeWidth="1.5"
					fill="none"
					opacity="0.2"
				/>

				{/* Designer dots pattern - Now Stable */}
				<g opacity="0.3">
					{dots.map((dot, i) => (
						<circle
							key={i}
							cx={`${dot.x}%`}
							cy={`${dot.y}%`}
							r={dot.r}
							fill={i % 2 ? primary : secondary}
							opacity={dot.opacity}
						/>
					))}
				</g>
			</svg>
		</Box>
	);
};

export default AbstractBackground;
