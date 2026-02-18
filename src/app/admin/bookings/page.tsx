import AdminBookings from '@features/admin/AdminBookings';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const AdminBookingsPage = () => (
	<Suspense fallback={<div>Loading...</div>}>
		<AdminBookings />
	</Suspense>
);
export default AdminBookingsPage;
