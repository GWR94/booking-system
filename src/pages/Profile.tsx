import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { camelToCapitalized } from '../utils/utils';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userState, setUserState] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "********"

  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {

    setIsEditing(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserState(prev => ({
      ...prev,
      [name]: value === '' ? null : value
    }));
  };

  const renderFields = () => {
    const fieldsToRender = [{
      key: "Name",
      value: userState.name ?? "",
    }, {
      key: "Email",
      value: user?.email ?? ""
    }];

    return fieldsToRender.map(({ key, value }) => {
      const label = camelToCapitalized(key);

      if (isEditing) {
        return (
          <TextField
            key={key}
            fullWidth
            label={label}
            name={key}
            value={value ?? ''}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        );
      }

      return (
        <Box
          key={key}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {label}:
          </Typography>
          <Typography variant="body1">
            {value ?? 'Not provided'}
          </Typography>
        </Box>
      );
    })

  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          User Profile
        </Typography>
        {renderFields()}
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>

        {!isEditing ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditToggle}
          >
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleEditToggle}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default ProfilePage;