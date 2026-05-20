import {
	Person,
	EventNote,
	Settings,
	Home,
	EventAvailable,
	Dashboard,
	People,
	WorkspacePremium,
	Info,
} from '@mui/icons-material';

export type NavItem = {
	name: string;
	path: string;
	icon: React.ReactNode;
};

export const PRIMARY_NAV_ITEMS: NavItem[] = [
	{ name: 'Home', path: '/', icon: <Home fontSize="small" /> },
	{ name: 'About', path: '/about', icon: <Info fontSize="small" /> },
	{ name: 'Book', path: '/book', icon: <EventAvailable fontSize="small" /> },
];

/** Shown on the right with basket / account on `md+` to save horizontal space by the logo. */
export const JOIN_NAV_ITEM: NavItem = {
	name: 'Join',
	path: '/membership',
	icon: <WorkspacePremium color="accent" fontSize="small" />,
};

/** Full list for mobile drawer and anywhere else that needs every destination. */
export const NAV_ITEMS: NavItem[] = [...PRIMARY_NAV_ITEMS, JOIN_NAV_ITEM];

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
