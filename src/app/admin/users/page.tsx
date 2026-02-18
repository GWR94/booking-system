import AdminUsers from '@features/admin/AdminUsers';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const AdminUsersPage = () => (
	<Suspense fallback={<div>Loading...</div>}>
		<AdminUsers />
	</Suspense>
);
export default AdminUsersPage;
