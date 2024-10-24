import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Repository } from '../types';

interface RepositoryState {
  repositories: Repository[];
  selectedRepo: Repository | null;
  loading: boolean;
  error: Error | null;
}

type RepositoryAction = 
  | { type: 'SET_REPOSITORIES'; payload: Repository[] }
  | { type: 'SELECT_REPOSITORY'; payload: Repository | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'ADD_REPOSITORY'; payload: Repository }
  | { type: 'UPDATE_REPOSITORY'; payload: Repository }
  | { type: 'REMOVE_REPOSITORY'; payload: string };

const initialState: RepositoryState = {
  repositories: [],
  selectedRepo: null,
  loading: false,
  error: null
};

const RepositoryContext = createContext<{
  state: RepositoryState;
  dispatch: React.Dispatch<RepositoryAction>;
  selectRepository: (repo: Repository | null) => void;
  updateRepository: (repo: Repository) => void;
  removeRepository: (id: string) => void;
} | undefined>(undefined);

function repositoryReducer(state: RepositoryState, action: RepositoryAction): RepositoryState {
  switch (action.type) {
    case 'SET_REPOSITORIES':
      return { ...state, repositories: action.payload };
    case 'SELECT_REPOSITORY':
      return { ...state, selectedRepo: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_REPOSITORY':
      return { ...state, repositories: [...state.repositories, action.payload] };
    case 'UPDATE_REPOSITORY':
      return {
        ...state,
        repositories: state.repositories.map(repo =>
          repo.id === action.payload.id ? action.payload : repo
        )
      };
    case 'REMOVE_REPOSITORY':
      return {
        ...state,
        repositories: state.repositories.filter(repo => repo.id !== action.payload),
        selectedRepo: state.selectedRepo?.id === action.payload ? null : state.selectedRepo
      };
    default:
      return state;
  }
}

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(repositoryReducer, initialState);

  const selectRepository = useCallback((repo: Repository | null) => {
    dispatch({ type: 'SELECT_REPOSITORY', payload: repo });
  }, []);

  const updateRepository = useCallback((repo: Repository) => {
    dispatch({ type: 'UPDATE_REPOSITORY', payload: repo });
  }, []);

  const removeRepository = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_REPOSITORY', payload: id });
  }, []);

  return (
    <RepositoryContext.Provider value={{
      state,
      dispatch,
      selectRepository,
      updateRepository,
      removeRepository
    }}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepository() {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error('useRepository must be used within a RepositoryProvider');
  }
  return context;
}
