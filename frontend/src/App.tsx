// frontend/src/App.tsx

import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from 'react-error-boundary';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ModalProvider } from './providers/ModalProvider';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { UserProvider } from './modules/user/UserContext';
import MusicPlayerControls from './modules/music/MusicPlayerControls';
import ErrorFallback from './components/ErrorFallback';
import LoadingSpinner from './components/common/LoadingSpinner';
import theme from '../theme';

// Eager-loaded components
import CreateCampaignPage from './modules/campaign/CreateCampaignPage';
import RepositoryBrowser from './modules/versionControl/RepositoryBrowser';
import AvatarCustomizationPage from './modules/avatar/AvatarCustomizationPage';
import RewardsPage from './components/RewardsPage';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./modules/dashboard/Dashboard'));
const AdminDashboard = lazy(() => import('./modules/dashboard/AdminDashboard'));
const EcoConsultantDashboard = lazy(() => import('./modules/dashboard/EcoConsultantDashboard'));
const AIDashboard = lazy(() => import('./modules/dashboard/AIDashboard'));
const DataTransparencyDashboard = lazy(() => import('./modules/dashboard/DataTransparencyDashboard'));
const UserSettings = lazy(() => import('./modules/user/UserSettings'));
const MinsiteBuilder = lazy(() => import('./modules/minsite/MinsiteBuilder'));
const Directory = lazy(() => import('./pages/Directory'));
const Marketplace = lazy(() => import('./modules/marketplace/Marketplace'));
const Analytics = lazy(() => import('./modules/dashboard/Analytics'));
const Forums = lazy(() => import('./modules/forum/Forums'));
const ForumPosts = lazy(() => import('./modules/forum/ForumPosts'));
const UserProfile = lazy(() => import('./modules/user/UserProfilePage'));
const WishlistPage = lazy(() => import('./modules/wishlist/WishlistPage'));
const CommunityWishlistPage = lazy(() => import('./modules/wishlist/CommunityWishlistPage'));
const UserSettingsPage = lazy(() => import('./modules/user/UserSettingsPage'));
const PrivateWishlistPage = lazy(() => import('./modules/wishlist/PrivateWishlistPage'));
const PublicWishlistPage = lazy(() => import('./modules/wishlist/PublicWishlistPage'));
const GroupCreationPage = lazy(() => import('./modules/group/GroupCreationPage'));
const GroupListPage = lazy(() => import('./modules/group/GroupListPage'));
const GroupDetailPage = lazy(() => import('./modules/group/GroupDetailPage'));
const PlaylistCreationPage = lazy(() => import('./modules/playlist/PlaylistCreationPage'));
const PlaylistListPage = lazy(() => import('./modules/playlist/PlaylistListPage'));
const PlaylistDetailsPage = lazy(() => import('./modules/playlist/PlaylistDetailsPage'));
const Social = lazy(() => import('./modules/forum/social'));

const queryClient = new QueryClient();

const routes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/u/:username', element: <UserProfile /> },
  { path: '/wishlist/public/:username', element: <PublicWishlistPage /> },
  { 
    path: '/dashboard', 
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    children: [
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'eco-consultant', element: <EcoConsultantDashboard /> },
      { path: 'ai', element: <AIDashboard /> },
      { path: 'data-transparency', element: <DataTransparencyDashboard /> },
      { path: 'settings', element: <UserSettings /> },
    ]
  },
  { path: '/minsite/:id?', element: <ProtectedRoute><MinsiteBuilder /></ProtectedRoute> },
  { path: '/campaigns/create', element: <ProtectedRoute><CreateCampaignPage /></ProtectedRoute> },
  { path: '/directory', element: <ProtectedRoute><Directory /></ProtectedRoute> },
  { path: '/marketplace', element: <ProtectedRoute><Marketplace /></ProtectedRoute> },
  { path: '/analytics', element: <ProtectedRoute><Analytics /></ProtectedRoute> },
  { path: '/forums', element: <ProtectedRoute><Forums /></ProtectedRoute> },
  { path: '/forums/:forumId', element: <ProtectedRoute><ForumPosts /></ProtectedRoute> },
  { path: '/wishlist', element: <ProtectedRoute><WishlistPage /></ProtectedRoute> },
  { path: '/wishlist/private', element: <ProtectedRoute><PrivateWishlistPage /></ProtectedRoute> },
  { path: '/wishlist/community', element: <ProtectedRoute><CommunityWishlistPage /></ProtectedRoute> },
  { path: '/groups', element: <ProtectedRoute><GroupListPage /></ProtectedRoute> },
  { path: '/groups/create', element: <ProtectedRoute><GroupCreationPage /></ProtectedRoute> },
  { path: '/groups/:id', element: <ProtectedRoute><GroupDetailPage /></ProtectedRoute> },
  { path: '/playlists', element: <ProtectedRoute><PlaylistListPage /></ProtectedRoute> },
  { path: '/playlists/create', element: <ProtectedRoute><PlaylistCreationPage /></ProtectedRoute> },
  { path: '/playlists/:playlistId', element: <ProtectedRoute><PlaylistDetailsPage /></ProtectedRoute> },
  { path: '/settings', element: <ProtectedRoute><UserSettingsPage /></ProtectedRoute> },
  { path: '/versionControl', element: <ProtectedRoute><RepositoryBrowser /></ProtectedRoute> },
  { path: '/avatar-customization', element: <ProtectedRoute><AvatarCustomizationPage /></ProtectedRoute> },
  { path: '/rewards', element: <ProtectedRoute><RewardsPage /></ProtectedRoute> },
  { path: '/profile', element: <ProtectedRoute><UserProfile /></ProtectedRoute> },
  { path: '/social', element: <ProtectedRoute><Social /></ProtectedRoute> },
  { path: '*', element: <Navigate to="/" replace /> },
];

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ModalProvider>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <ErrorProvider>
                <UserProvider>
                  <Router>
                    <MusicPlayerProvider>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                          {routes.map((route, index) => (
                            <Route key={index} path={route.path} element={route.element}>
                              {route.children && route.children.map((childRoute, childIndex) => (
                                <Route key={childIndex} path={childRoute.path} element={childRoute.element} />
                              ))}
                            </Route>
                          ))}
                        </Routes>
                      </Suspense>
                      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
                      <MusicPlayerControls />
                    </MusicPlayerProvider>
                  </Router>
                </UserProvider>
              </ErrorProvider>
            </ErrorBoundary>
          </ModalProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
