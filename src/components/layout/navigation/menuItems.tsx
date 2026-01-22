import {
	Person,
	EventNote,
	Settings,
	Home,
	Info,
	EventAvailable,
	Dashboard,
	People,
} from '@mui/icons-material';

export type NavItem = {
	name: string;
	path: string;
	icon: React.ReactNode;
};

export const NAV_ITEMS: NavItem[] = [
	{ name: 'Home', path: '/', icon: <Home fontSize="small" /> },
	{ name: 'About', path: '/about', icon: <Info fontSize="small" /> },
	{ name: 'Book', path: '/book', icon: <EventAvailable fontSize="small" /> },
];

export const PROFILE_MENU_ITEMS = [
	{
		label: 'Overview',
		dropdownLabel: 'Profile',
		path: '/profile/overview',
		Icon: Person,
	},
	{
		label: 'My Bookings',
		path: '/profile/bookings',
		Icon: EventNote,
	},
	{
		label: 'Settings',
		path: '/profile/settings',
		Icon: Settings,
	},
];

export const ADMIN_MENU_ITEMS = [
	{
		label: 'Dashboard',
		path: '/admin/dashboard',
		Icon: Dashboard,
	},
	{
		label: 'Bookings',
		path: '/admin/bookings',
		Icon: EventNote,
	},
	{
		label: 'Users',
		path: '/admin/users',
		Icon: People,
	},
	{
		label: 'Block Outs',
		path: '/admin/block-outs',
		Icon: EventAvailable, // Using EventAvailable as placeholder or import Block
	},
];
