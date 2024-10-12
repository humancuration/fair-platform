// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import api from '@api/api';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/slices/userSlice';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', { email, password });
      dispatch(setToken(response.data.token));
      // Redirect to dashboard
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
    </form>
  );
};

export default LoginPage;
