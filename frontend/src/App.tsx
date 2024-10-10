// frontend/src/App.tsx

import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ErrorBoundary from '@components/ErrorBoundary';
import ProtectedRoute from '@components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ModalProvider } from './providers/ModalProvider';
import { MusicPlayerProvider } from '@contexts/MusicPlayerContext';
import { ErrorProvider } from '@contexts/ErrorContext';
import MusicPlayerControls from '@components/MusicPlayerControls';
import ErrorDisplay from '@components/ErrorDisplay';

// Lazy-loaded components
const Home = lazy(() => import('@pages/Home'));
const Login = lazy(() => import('@pages/Login'));
const Signup = lazy(() => import('@pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const EcoConsultantDashboard = lazy(() => import('./pages/EcoConsultantDashboard'));
const AIDashboard = lazy(() => import('./components/AIDashboard'));
const DataTransparencyDashboard = lazy(() => import('./components/DataTransparencyDashboard'));
const UserSettings = lazy(() => import('./components/UserSettings'));
const MinsiteBuilder = lazy(() => import('@pages/MinsiteBuilder'));
const Directory = lazy(() => import('@pages/Directory'));
const Marketplace = lazy(() => import('@pages/Marketplace'));
const Analytics = lazy(() => import('@pages/Analytics'));
const Forums = lazy(() => import('@pages/Forums'));
const ForumPosts = lazy(() => import('@pages/ForumPosts'));
const UserProfile = lazy(() => import('@pages/UserProfilePage'));
const WishlistPage = lazy(() => import('@pages/WishlistPage'));
const CommunityWishlistPage = lazy(() => import('@pages/CommunityWishlistPage'));
const UserSettingsPage = lazy(() => import('@pages/UserSettingsPage'));
const PrivateWishlistPage = lazy(() => import('@pages/PrivateWishlistPage'));
const PublicWishlistPage = lazy(() => import('@pages/PublicWishlistPage'));
const GroupCreationPage = lazy(() => import('./pages/GroupCreationPage'));
const GroupListPage = lazy(() => import('./pages/GroupListPage'));
const GroupDetailPage = lazy(() => import('./pages/GroupDetailPage'));

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ModalProvider>
        <ErrorBoundary>
          <ErrorProvider>
            <Router>
              <MusicPlayerProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/u/:username" element={<UserProfile />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                      <Route path="admin" element={<AdminDashboard />} />
                      <Route path="eco-consultant" element={<EcoConsultantDashboard />} />
                      <Route path="ai" element={<AIDashboard />} />
                      <Route path="data-transparency" element={<DataTransparencyDashboard />} />
                      <Route path="settings" element={<UserSettings />} />
                    </Route>
                    <Route path="/minsite/:id?" element={<ProtectedRoute><MinsiteBuilder /></ProtectedRoute>} />
                    <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
                    <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                    <Route path="/forums" element={<ProtectedRoute><Forums /></ProtectedRoute>} />
                    <Route path="/forums/:forumId" element={<ProtectedRoute><ForumPosts /></ProtectedRoute>} />
                    <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                    <Route path="/wishlist/private" element={<ProtectedRoute><PrivateWishlistPage /></ProtectedRoute>} />
                    <Route path="/wishlist/public/:username" element={<PublicWishlistPage />} />
                    <Route path="/wishlist/community" element={<ProtectedRoute><CommunityWishlistPage /></ProtectedRoute>} />
                    <Route path="/groups" element={<ProtectedRoute><GroupListPage /></ProtectedRoute>} />
                    <Route path="/groups/create" element={<ProtectedRoute><GroupCreationPage /></ProtectedRoute>} />
                    <Route path="/groups/:id" element={<ProtectedRoute><GroupDetailPage /></ProtectedRoute>} />

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
                <MusicPlayerControls />
                <ErrorDisplay />
              </MusicPlayerProvider>
            </Router>
          </ErrorProvider>
        </ErrorBoundary>
      </ModalProvider>
    </Provider>
  );
};

export default App;
