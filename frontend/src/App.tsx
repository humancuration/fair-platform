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
const AffiliateLinksPage = lazy(() => import('./pages/AffiliateLinksPage'));
const AffiliateAnalyticsPage = lazy(() => import('./pages/AffiliateAnalyticsPage'));
const AIFeedbackPage = lazy(() => import('./pages/AIFeedbackPage'));
const LinkInBioPage = lazy(() => import('./pages/LinkInBioPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ActivityLogPage = lazy(() => import('./pages/ActivityLogPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="affiliate-links" element={<AffiliateLinksPage />} />
              <Route path="affiliate-analytics/:id" element={<AffiliateAnalyticsPage />} />
              <Route path="u/:username" element={<LinkInBioPage />} />
              <Route path="ai-feedback" element={<AIFeedbackPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="minsite/:id?" element={<MinsiteBuilder />} />
                <Route path="directory" element={<Directory />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="forums" element={<Forums />} />
                <Route path="forums/:forumId" element={<ForumPosts />} />
                <Route path="/dashboard/*" element={<Dashboard />}>
                  <Route path="affiliate-links" element={<AffiliateLinksPage />} />
                  <Route path="affiliate-analytics" element={<AffiliateAnalyticsPage />} />
                  <Route path="profile" element={<UserProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="activity-log" element={<ActivityLogPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                </Route>
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
          </Suspense>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
