// frontend/src/App.tsx

import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const MinsiteBuilder = lazy(() => import('./pages/MinsiteBuilder'));
const Directory = lazy(() => import('./pages/Directory'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Forums = lazy(() => import('./pages/Forums'));
const ForumPosts = lazy(() => import('./pages/ForumPosts'));
const UserProfile = lazy(() => import('./pages/UserProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CommunityWishlistPage = lazy(() => import('./pages/CommunityWishlistPage'));
const UserSettingsPage = lazy(() => import('./pages/UserSettingsPage'));

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/minsite/:id?" element={<MinsiteBuilder />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/forums" element={<Forums />} />
                <Route path="/forums/:forumId" element={<ForumPosts />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/community-wishlist" element={<CommunityWishlistPage />} />
                <Route path="/settings" element={<UserSettingsPage />} />
              </Route>
              <Route path="/u/:username" element={<UserProfile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
          </Suspense>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;