import AdminBlockOuts from '@features/admin/AdminBlockOuts';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const AdminBlockOutsPage = () => (
	<Suspense fallback={<div>Loading...</div>}>
		<AdminBlockOuts />
	</Suspense>
);
export default AdminBlockOutsPage;
