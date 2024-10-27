import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '../../../hooks/useToast';
import logger from '../../../../app/utils/logger.client';
import { Repository } from '../types';

interface UseRepoWebSocketProps {
  repoId: string;
  onUpdate?: (data: any) => void;
}

export const useRepoWebSocket = ({ repoId, onUpdate }: UseRepoWebSocketProps) => {
  const { error: showError } = useToast();
  
  const handleRepoUpdate = useCallback((data: any) => {
    logger.info('Received repo update:', data);
    if (onUpdate) {
      onUpdate(data);
    }
  }, [onUpdate]);

  useEffect(() => {
    let socket: Socket;

    try {
      socket = io(process.env.REACT_APP_WS_URL || 'ws://localhost:3001', {
        path: '/version-control',
        auth: {
          token: localStorage.getItem('authToken')
        }
      });

      socket.on('connect', () => {
        logger.info('Connected to version control websocket');
        socket.emit('subscribe-repo', repoId);
      });

      socket.on('repo-update', handleRepoUpdate);

      socket.on('error', (error) => {
        logger.error('WebSocket error:', error);
        showError('Lost connection to repository updates');
      });

      socket.on('disconnect', () => {
        logger.warn('Disconnected from version control updates');
      });
    } catch (error) {
      logger.error('Error setting up WebSocket:', error);
      showError('Failed to connect to repository updates');
    }

    return () => {
      if (socket) {
        socket.off('repo-update', handleRepoUpdate);
        socket.disconnect();
      }
    };
  }, [repoId, handleRepoUpdate, showError]);
};
