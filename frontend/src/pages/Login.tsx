import React, { useState } from 'react';
import api from '../api/api';
import { handleError } from '../utils/errorHandler';
import { toast } from 'react-toastify';
import TextInput from '../components/TextInput';
import Button from '../components/common/Button';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/slices/userSlice';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      dispatch(setToken(response.data.token));
      toast.success('Logged in successfully!');
      // Redirect to dashboard
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <TextInput
        label="Email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Enter your email"
      />
      <TextInput
        label="Password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Enter your password"
      />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default Login;
