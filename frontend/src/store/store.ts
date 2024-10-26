import { createContext, useReducer, useContext, ReactNode, FC } from 'react';
import type { Playlist } from '../types/playlist';

// Define base types
export interface User {
  token: string;
  id?: string;
  email?: string;
}

export interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
}

export interface UserSettings {
  language: string;
  notifications: boolean;
  timezone: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type?: 'background' | 'outfit' | 'accessory';
}

// Define the global state interface
export interface GlobalState {
  user: User;
  theme: Theme;
  userSettings: UserSettings;
  notifications: Notification[];
  marketplace: {
    products: MarketplaceItem[];
    recommendations: MarketplaceItem[];
    loading: boolean;
    error: string | null;
  };
  playlists: {
    items: Playlist[];
    loading: boolean;
    error: string | null;
  };
}

// Add this export near the top of the file, after your GlobalState interface
export type RootState = GlobalState;

// Define action types
export type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'SET_MARKETPLACE_PRODUCTS'; payload: MarketplaceItem[] }
  | { type: 'SET_MARKETPLACE_LOADING'; payload: boolean }
  | { type: 'SET_MARKETPLACE_ERROR'; payload: string | null }
  | { type: 'SET_PLAYLISTS'; payload: Playlist[] }
  | { type: 'SET_PLAYLISTS_LOADING'; payload: boolean }
  | { type: 'SET_PLAYLISTS_ERROR'; payload: string | null };

// Initial state
const initialState: GlobalState = {
  user: { token: '' },
  theme: {
    mode: 'light',
    primary: '#1976d2',
    secondary: '#dc004e',
  },
  userSettings: {
    language: 'en',
    notifications: true,
    timezone: 'UTC',
  },
  notifications: [],
  marketplace: {
    products: [],
    recommendations: [],
    loading: false,
    error: null,
  },
  playlists: {
    items: [],
    loading: false,
    error: null,
  },
};

// Update the context creation with proper typing
type StateContextType = {
  state: GlobalState;
  dispatch: React.Dispatch<AppAction>;
};

const StateContext = createContext<StateContextType | undefined>(undefined);

// Reducer function
function reducer(state: GlobalState, action: AppAction): GlobalState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        userSettings: { ...state.userSettings, ...action.payload },
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'SET_MARKETPLACE_PRODUCTS':
      return {
        ...state,
        marketplace: { ...state.marketplace, products: action.payload },
      };
    case 'SET_MARKETPLACE_LOADING':
      return {
        ...state,
        marketplace: { ...state.marketplace, loading: action.payload },
      };
    case 'SET_MARKETPLACE_ERROR':
      return {
        ...state,
        marketplace: { ...state.marketplace, error: action.payload },
      };
    case 'SET_PLAYLISTS':
      return {
        ...state,
        playlists: {
          ...state.playlists,
          items: action.payload,
          error: null,
        },
      };
    case 'SET_PLAYLISTS_LOADING':
      return {
        ...state,
        playlists: {
          ...state.playlists,
          loading: action.payload,
        },
      };
    case 'SET_PLAYLISTS_ERROR':
      return {
        ...state,
        playlists: {
          ...state.playlists,
          error: action.payload,
        },
      };
    default:
      return state;
  }
}

// Update the Provider component with proper FC typing
export const StateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

// Custom hooks for accessing state and dispatch
export function useGlobalState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a StateProvider');
  }
  return context;
}

// Typed selector hooks
export function useUser() {
  const { state } = useGlobalState();
  return state.user;
}

export function useTheme() {
  const { state } = useGlobalState();
  return state.theme;
}

export function useUserSettings() {
  const { state } = useGlobalState();
  return state.userSettings;
}

export function useNotifications() {
  const { state } = useGlobalState();
  return state.notifications;
}

export function useMarketplace() {
  const { state } = useGlobalState();
  return state.marketplace;
}
