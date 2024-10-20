// frontend/src/App.tsx

import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './modulesf/store';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ModalProvider } from './providers/ModalProvider';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { UserProvider } from './modulesf/user/UserContext';
import MusicPlayerControls from './modulesf/music/MusicPlayerControls';
import ErrorDisplay from './components/ErrorDisplay';

// Eager-loaded components
import CreateCampaignPage from './modulesf/campaign/CreateCampaignPage';
import RepositoryBrowser from './modulesf/versionControl/RepositoryBrowser';
import AvatarCustomizationPage from './modulesf/avatar/AvatarCustomizationPage';
import RewardsPage from './components/RewardsPage';

// Lazy-loaded components
const Home = lazy(() => import('@pages/Home'));
const Login = lazy(() => import('@pages/Login'));
const Signup = lazy(() => import('@pages/Signup'));
const Dashboard = lazy(() => import('./modulesf/dashboard/Dashboard'));
const AdminDashboard = lazy(() => import('./modulesf/dashboard/AdminDashboard'));
const EcoConsultantDashboard = lazy(() => import('./modulesf/dashboard/EcoConsultantDashboard'));
const AIDashboard = lazy(() => import('./modulesf/ai/AIDashboard'));
const DataTransparencyDashboard = lazy(() => import('./modulesf/dashboard/DataTransparencyDashboard'));
const UserSettings = lazy(() => import('./modulesf/user/UserSettings'));
const MinsiteBuilder = lazy(() => import('./modulesf/minsite/MinsiteBuilder'));
const Directory = lazy(() => import('@pages/Directory'));
const Marketplace = lazy(() => import('./modulesf/marketplace/Marketplace'));
const Analytics = lazy(() => import('./modulesf/dashboard/Analytics'));
const Forums = lazy(() => import('./modulesf/forum/Forums'));
const ForumPosts = lazy(() => import('./modulesf/forum/ForumPosts'));
const UserProfile = lazy(() => import('@/modulesf/user/UserProfilePage'));
const WishlistPage = lazy(() => import('./modulesf/wishlist/WishlistPage'));
const CommunityWishlistPage = lazy(() => import('./modulesf/wishlist/CommunityWishlistPage'));
const UserSettingsPage = lazy(() => import('./modulesf/user/UserSettingsPage'));
const PrivateWishlistPage = lazy(() => import('./modulesf/wishlist/PrivateWishlistPage'));
const PublicWishlistPage = lazy(() => import('@/modulesf/wishlist/PublicWishlistPage'));
const GroupCreationPage = lazy(() => import('./modulesf/groups/GroupCreationPage'));
const GroupListPage = lazy(() => import('./modulesf/groups/GroupListPage'));
const GroupDetailPage = lazy(() => import('./modulesf/groups/GroupDetailPage'));
const PlaylistCreationPage = lazy(() => import('./modulesf/playlist/PlaylistCreationPage'));
const PlaylistListPage = lazy(() => import('./modulesf/playlist/PlaylistListPage'));
const PlaylistDetailsPage = lazy(() => import('./modulesf/playlist/PlaylistDetailsPage'));

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ModalProvider>
        <ErrorBoundary>
          <ErrorProvider>
            <UserProvider>
              <Router>
                <MusicPlayerProvider>
                  <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/u/:username" element={<UserProfile />} />
                      <Route path="/wishlist/public/:username" element={<PublicWishlistPage />} />

                      {/* Protected Routes */}
                      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                        <Route path="admin" element={<AdminDashboard />} />
                        <Route path="eco-consultant" element={<EcoConsultantDashboard />} />
                        <Route path="ai" element={<AIDashboard />} />
                        <Route path="data-transparency" element={<DataTransparencyDashboard />} />
                        <Route path="settings" element={<UserSettings />} />
                      </Route>
                      <Route path="/minsite/:id?" element={<ProtectedRoute><MinsiteBuilder /></ProtectedRoute>} />
                      <Route path="/campaigns/create" element={<ProtectedRoute><CreateCampaignPage /></ProtectedRoute>} />
                      <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
                      <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                      <Route path="/forums" element={<ProtectedRoute><Forums /></ProtectedRoute>} />
                      <Route path="/forums/:forumId" element={<ProtectedRoute><ForumPosts /></ProtectedRoute>} />
                      <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                      <Route path="/wishlist/private" element={<ProtectedRoute><PrivateWishlistPage /></ProtectedRoute>} />
                      <Route path="/wishlist/community" element={<ProtectedRoute><CommunityWishlistPage /></ProtectedRoute>} />
                      <Route path="/groups" element={<ProtectedRoute><GroupListPage /></ProtectedRoute>} />
                      <Route path="/groups/create" element={<ProtectedRoute><GroupCreationPage /></ProtectedRoute>} />
                      <Route path="/groups/:id" element={<ProtectedRoute><GroupDetailPage /></ProtectedRoute>} />
                      <Route path="/playlists" element={<ProtectedRoute><PlaylistListPage /></ProtectedRoute>} />
                      <Route path="/playlists/create" element={<ProtectedRoute><PlaylistCreationPage /></ProtectedRoute>} />
                      <Route path="/playlists/:playlistId" element={<ProtectedRoute><PlaylistDetailsPage /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><UserSettingsPage /></ProtectedRoute>} />
                      <Route path="/versionControl" element={<ProtectedRoute><RepositoryBrowser /></ProtectedRoute>} />  
                      <Route path="/avatar-customization" element={<ProtectedRoute><AvatarCustomizationPage /></ProtectedRoute>} />
                      <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

                      {/* Fallback route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                  <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
                  <MusicPlayerControls />
                  <ErrorDisplay />
                </MusicPlayerProvider>
              </Router>
            </UserProvider>
          </ErrorProvider>
        </ErrorBoundary>
      </ModalProvider>
    </Provider>
  );
};

export default App;
