import AdminDashboard from '@features/admin/AdminDashboard';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AdminDashboard />
		</Suspense>
	);
}
