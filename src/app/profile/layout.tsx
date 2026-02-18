import { Metadata } from 'next';
import ProfileLayoutClient from './ProfileLayoutClient';

export const metadata: Metadata = {
	title: 'Profile | The Short Grass',
	description:
		'Manage your profile, bookings, and settings at The Short Grass.',
};

const ProfileLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => <ProfileLayoutClient>{children}</ProfileLayoutClient>;
export default ProfileLayout;
