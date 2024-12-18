import React from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoadingSpinnerProps {
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  color = 'primary',
  size = 50
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: "80px",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: "1px solid blue"
      }}
    >
      <CircularProgress
        color={color}
        size={size}
      />
    </Box>
  );
};

export default LoadingSpinner;