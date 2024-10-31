import { useMatches } from '@remix-run/react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export const useUser = () => {
  const matches = useMatches();
  const rootData = matches.find(match => match.id === 'root')?.data;

  return {
    user: rootData?.user as User | undefined,
    isAuthenticated: !!rootData?.user,
  };
}; 