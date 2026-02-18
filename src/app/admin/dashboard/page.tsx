import AdminDashboard from '@features/admin/AdminDashboard';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const AdminDashboardPage = () => (
	<Suspense fallback={<div>Loading...</div>}>
		<AdminDashboard />
	</Suspense>
);
export default AdminDashboardPage;
