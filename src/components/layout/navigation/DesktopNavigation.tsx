'use client';

import { alpha, Box, Button, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { NavItem } from './menuItems';

interface DesktopNavigationProps {
	navItems: NavItem[];
}

const DesktopNavigation = ({ navItems }: DesktopNavigationProps) => {
	const pathname = usePathname();
	const theme = useTheme();
	const router = useRouter();

	const isActive = (path: string) => pathname === path;

	return (
		<Box
			sx={{
				display: { xs: 'none', md: 'flex' },
				ml: 2,
				gap: 1,
			}}
		>
			{navItems.map((item) => (
				<Button
					key={item.name}
					onClick={() => router.push(item.path)}
					sx={{
						px: 2,
						py: 1,
						my: 1,
						color: 'white',
						display: 'flex',
						alignItems: 'center',
						fontWeight: isActive(item.path) ? 700 : 500,
						position: 'relative',
						overflow: 'hidden',
						borderRadius: 1,
						'&:hover': {
							backgroundColor: alpha(theme.palette.link.light, 0.1),
						},
						'&::after': isActive(item.path)
							? {
									content: '""',
									position: 'absolute',
									bottom: 0,
									left: '50%',
									width: '40%',
									transform: 'translateX(-50%)',
									height: 3,
									backgroundColor: theme.palette.accent.main,
									borderRadius: 4,
								}
							: {},
					}}
				>
					<Box
						component="span"
						sx={{
							display: 'flex',
							alignItems: 'center',
							opacity: isActive(item.path) ? 1 : 0.85,
						}}
					>
						{item.icon}
						<Box component="span" sx={{ ml: 1 }}>
							{item.name}
						</Box>
					</Box>
				</Button>
			))}
		</Box>
	);
};

export default DesktopNavigation;
