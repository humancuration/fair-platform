// src/App.tsx (Update)
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Directory from './pages/Directory';
import Marketplace from './pages/Marketplace';
import Login from './pages/Login';
import LoginPage from './pages/LoginPage';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Analytics from './pages/Analytics';
import Forums from './pages/Forums';
import ForumPosts from './pages/ForumPosts';
import ProtectedRoute from './components/ProtectedRoute';
import AffiliateLinksPage from './pages/AffiliateLinksPage';
import AffiliateAnalyticsPage from './pages/AffiliateAnalyticsPage';
import AIFeedbackPage from './pages/AIFeedbackPage';
import MinsiteBuilder from './pages/MinsiteBuilder';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/affiliate-links" component={AffiliateLinksPage} />
          <Route path="/affiliate-analytics/:id" component={AffiliateAnalyticsPage} />
          <Route path="/u/:username" component={LinkInBioPage} />
          <Route path="/ai-feedback" component={AIFeedbackPage} />
          <PrivateRoute path="/directory" com ponent={Directory} />
          <PrivateRoute path="/marketplace" component={Marketplace} />
          <PrivateRoute path="/analytics" component={Analytics} />  
          <PrivateRoute path="/forums/:forumId" component={ForumPosts} />
          <PrivateRoute path="/forums" component={Forums} />
          <ProtectedRoute path="/builder" component={MinsiteBuilder} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <div className="bg-white dark:bg-gray-800 min-h-screen">
          {/* Your Navbar with Dark Mode Toggle */}
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <Switch>
            {/* Your Routes */}
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
