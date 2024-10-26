import { useCallback } from 'react';
import { useGlobalState } from './store';
import type { GlobalState, AppAction } from './store';
import type { Playlist } from '../types/playlist';

// Custom hook for typed dispatch actions
export const useAppDispatch = () => {
  const { dispatch } = useGlobalState();
  return useCallback(
    (action: AppAction) => {
      dispatch(action);
    },
    [dispatch]
  );
};

// Custom hook for typed selectors
export function useAppSelector<TSelected>(
  selector: (state: GlobalState) => TSelected
): TSelected {
  const { state } = useGlobalState();
  return selector(state);
}

// Commonly used selectors
export const useAuth = () => useAppSelector((state) => state.user);
export const useThemeSelector = () => useAppSelector((state) => state.theme);
export const useUserSettingsSelector = () => useAppSelector((state) => state.userSettings);
export const useNotificationsSelector = () => useAppSelector((state) => state.notifications);
export const useMarketplaceSelector = () => useAppSelector((state) => state.marketplace);

// Action creators
export const createActions = {
  setUser: (payload: GlobalState['user']) => ({
    type: 'SET_USER' as const,
    payload,
  }),
  setTheme: (payload: GlobalState['theme']) => ({
    type: 'SET_THEME' as const,
    payload,
  }),
  updateSettings: (payload: Partial<GlobalState['userSettings']>) => ({
    type: 'UPDATE_SETTINGS' as const,
    payload,
  }),
  addNotification: (payload: GlobalState['notifications'][0]) => ({
    type: 'ADD_NOTIFICATION' as const,
    payload,
  }),
  setMarketplaceProducts: (payload: GlobalState['marketplace']['products']) => ({
    type: 'SET_MARKETPLACE_PRODUCTS' as const,
    payload,
  }),
  setMarketplaceLoading: (payload: boolean) => ({
    type: 'SET_MARKETPLACE_LOADING' as const,
    payload,
  }),
  setMarketplaceError: (payload: string | null) => ({
    type: 'SET_MARKETPLACE_ERROR' as const,
    payload,
  }),
};

// Example usage of combined hooks
export const useThemeActions = () => {
  const dispatch = useAppDispatch();
  const theme = useThemeSelector();

  return {
    theme,
    setTheme: useCallback(
      (newTheme: GlobalState['theme']) => {
        dispatch(createActions.setTheme(newTheme));
      },
      [dispatch]
    ),
    toggleTheme: useCallback(() => {
      dispatch(
        createActions.setTheme({
          ...theme,
          mode: theme.mode === 'light' ? 'dark' : 'light',
        })
      );
    }, [dispatch, theme]),
  };
};

export const useNotificationActions = () => {
  const dispatch = useAppDispatch();
  const notifications = useNotificationsSelector();

  return {
    notifications,
    addNotification: useCallback(
      (notification: Omit<GlobalState['notifications'][0], 'id'>) => {
        dispatch(
          createActions.addNotification({
            ...notification,
            id: crypto.randomUUID(),
          })
        );
      },
      [dispatch]
    ),
  };
};

export const useMarketplaceActions = () => {
  const dispatch = useAppDispatch();
  const marketplace = useMarketplaceSelector();

  return {
    marketplace,
    setProducts: useCallback(
      (products: GlobalState['marketplace']['products']) => {
        dispatch(createActions.setMarketplaceProducts(products));
      },
      [dispatch]
    ),
    setLoading: useCallback(
      (loading: boolean) => {
        dispatch(createActions.setMarketplaceLoading(loading));
      },
      [dispatch]
    ),
    setError: useCallback(
      (error: string | null) => {
        dispatch(createActions.setMarketplaceError(error));
      },
      [dispatch]
    ),
  };
};

export const usePlaylistActions = () => {
  const dispatch = useAppDispatch();
  const playlists = useAppSelector(state => state.playlists);

  return {
    playlists,
    setPlaylists: useCallback(
      (items: Playlist[]) => {
        dispatch({ type: 'SET_PLAYLISTS', payload: items });
      },
      [dispatch]
    ),
    setLoading: useCallback(
      (loading: boolean) => {
        dispatch({ type: 'SET_PLAYLISTS_LOADING', payload: loading });
      },
      [dispatch]
    ),
    setError: useCallback(
      (error: string | null) => {
        dispatch({ type: 'SET_PLAYLISTS_ERROR', payload: error });
      },
      [dispatch]
    ),
  };
};
