import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding={3}
      textAlign="center"
    >
      <Typography variant="h4" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {error.message}
      </Typography>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </Box>
  );
};

export default ErrorFallback;
