import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuth();
  
  const connect = useCallback(() => {
    if (!token) return;

    const socket = io(process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:4000', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      toast.error('Connection lost. Trying to reconnect...');
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    socketRef.current = socket;
    return socket;
  }, [token]);

  useEffect(() => {
    const socket = connect();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [connect]);

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event: string) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  }, []);

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
  };
};
