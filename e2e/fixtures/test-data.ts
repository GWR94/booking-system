export const TEST_USER = {
	email: 'test@example.com',
	password: 'Test123!',
	name: 'Test User',
};

export const TEST_ADMIN = {
	email: 'admin@example.com',
	password: 'Admin123!',
	name: 'Admin User',
};

export const STRIPE_TEST_CARDS = {
	success: '4242424242424242',
	declined: '4000000000000002',
	requiresAuth: '4000002500003155',
};

export const TEST_BOOKING = {
	date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
	session: 1,
	bay: 1,
	time: '10:00-11:00',
};
