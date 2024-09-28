import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

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

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="affiliate-links" element={<AffiliateLinksPage />} />
                <Route path="affiliate-analytics/:id" element={<AffiliateAnalyticsPage />} />
                <Route path="u/:username" element={<LinkInBioPage />} />
                <Route path="ai-feedback" element={<AIFeedbackPage />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route path="minsite/:id?" element={<MinsiteBuilder />} />
                  <Route path="directory" element={<Directory />} />
                  <Route path="marketplace" element={<Marketplace />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="forums" element={<Forums />} />
                  <Route path="forums/:forumId" element={<ForumPosts />} />
                  <Route path="builder" element={<MinsiteBuilder />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
