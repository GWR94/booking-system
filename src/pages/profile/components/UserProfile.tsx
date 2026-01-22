import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import ViewProfile from './ViewProfile';
import EditProfile from './EditProfile';

export interface UserState {
	name: string;
	email: string;
	password: string;
	newPassword: string;
	confirmPassword: string;
}

const UserProfile = () => {
	const [isEditing, setIsEditing] = useState(false);

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
	};

	return (
		<Box sx={{ maxWidth: '600px', mx: 'auto' }}>
			{isEditing ? (
				<EditProfile handleEditToggle={handleEditToggle} />
			) : (
				<ViewProfile handleEditToggle={handleEditToggle} />
			)}
		</Box>
	);
};

export default UserProfile;
