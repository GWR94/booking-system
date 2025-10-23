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

	const handleSave = () => {
		// TODO
		setIsEditing(false);
	};

	return (
		<>
			<Box maxWidth="sm" margin="auto">
				<Typography
					variant="h4"
					component="h1"
					sx={{ mb: 3, textAlign: 'center' }}
				>
					User Profile
				</Typography>
				{isEditing ? (
					<EditProfile
						handleSave={handleSave}
						handleEditToggle={handleEditToggle}
					/>
				) : (
					<ViewProfile handleEditToggle={handleEditToggle} />
				)}
			</Box>
		</>
	);
};

export default UserProfile;
