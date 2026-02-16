import AdminUsers from '@features/admin/AdminUsers';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function AdminUsersPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AdminUsers />
		</Suspense>
	);
}
