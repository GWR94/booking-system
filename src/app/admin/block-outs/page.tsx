import AdminBlockOuts from '@features/admin/AdminBlockOuts';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function AdminBlockOutsPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AdminBlockOuts />
		</Suspense>
	);
}
