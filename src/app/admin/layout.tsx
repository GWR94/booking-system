import { Metadata } from 'next';
import AdminLayoutClient from './AdminLayoutClient';

export const metadata: Metadata = {
	title: 'Admin | The Short Grass',
	description: 'Manage the booking system.',
};

const AdminLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => <AdminLayoutClient>{children}</AdminLayoutClient>;
export default AdminLayout;
