import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorBoundary } from 'react-error-boundary';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

// React Query hooks
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await axios.post('/api/auth/login', credentials);
      localStorage.setItem('token', data.token);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    }
  });
};

export const useUserQuery = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await axios.get('/api/auth/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return data;
    },
    enabled: !!localStorage.getItem('token')
  });
};

// Redux slice for auth state
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
  } as AuthState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, logout } = authSlice.actions;

export default authSlice.reducer;

// Error Boundary component for auth-related errors
export const AuthErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary
    fallbackRender={({ error }) => (
      <div className="auth-error">
        <h3>Authentication Error</h3>
        <p>{error.message}</p>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);
