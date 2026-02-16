import AdminBookings from '@features/admin/AdminBookings';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function AdminBookingsPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AdminBookings />
		</Suspense>
	);
}
