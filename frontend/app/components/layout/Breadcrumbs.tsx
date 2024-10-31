import { Link, useMatches } from '@remix-run/react';
import { motion } from 'framer-motion';
import { 
  FaHome,
  FaRobot, // ai
  FaHeadphones, // audio
  FaUser, // avatar/user
  FaCalendar,
  FaHandHoldingHeart, // campaign
  FaPuzzlePiece, // collaboration
  FaUsers, // community
  FaChartLine, // dashboard
  FaFolder, // directory
  FaLeaf, // eco/ecosystem
  FaWpforms, // forms
  FaComments, // forum
  FaBalanceScale, // governance
  FaUserFriends, // group
  FaStore, // marketplace
  FaPaintBrush, // minsite
  FaMusic,
  FaPlayCircle, // playlist
  FaPoll,
  FaAtom, // quantum
  FaCode, // repository
  FaFlask, // science
  FaShareAlt, // social
  FaLifeRing, // support
  FaClipboardList, // survey
  FaPalette, // themes
  FaVrCardboard, // venue
  FaChartBar, // visualization
  FaHeart // wishlist
} from 'react-icons/fa';

interface BreadcrumbConfig {
  path: string;
  label: string;
  icon: React.ComponentType;
}

const routes: BreadcrumbConfig[] = [
  { path: '/', label: 'Home', icon: FaHome },
  { path: '/ai', label: 'AI', icon: FaRobot },
  { path: '/audio', label: 'Audio', icon: FaHeadphones },
  { path: '/avatar', label: 'Avatar', icon: FaUser },
  { path: '/calendar', label: 'Calendar', icon: FaCalendar },
  { path: '/campaign', label: 'Campaigns', icon: FaHandHoldingHeart },
  { path: '/collaboration', label: 'Collaboration', icon: FaPuzzlePiece },
  { path: '/community', label: 'Community', icon: FaUsers },
  { path: '/dashboard', label: 'Dashboard', icon: FaChartLine },
  { path: '/directory', label: 'Directory', icon: FaFolder },
  { path: '/eco', label: 'Eco', icon: FaLeaf },
  { path: '/ecosystem', label: 'Ecosystem', icon: FaLeaf },
  { path: '/forms', label: 'Forms', icon: FaWpforms },
  { path: '/forum', label: 'Forum', icon: FaComments },
  { path: '/governance', label: 'Governance', icon: FaBalanceScale },
  { path: '/group', label: 'Groups', icon: FaUserFriends },
  { path: '/marketplace', label: 'Marketplace', icon: FaStore },
  { path: '/minsite', label: 'Site Builder', icon: FaPaintBrush },
  { path: '/music', label: 'Music', icon: FaMusic },
  { path: '/playlist', label: 'Playlists', icon: FaPlayCircle },
  { path: '/poll', label: 'Polls', icon: FaPoll },
  { path: '/quantum', label: 'Quantum', icon: FaAtom },
  { path: '/repository', label: 'Repository', icon: FaCode },
  { path: '/science', label: 'Science', icon: FaFlask },
  { path: '/social', label: 'Social', icon: FaShareAlt },
  { path: '/support', label: 'Support', icon: FaLifeRing },
  { path: '/survey', label: 'Surveys', icon: FaClipboardList },
  { path: '/themes', label: 'Themes', icon: FaPalette },
  { path: '/user', label: 'Profile', icon: FaUser },
  { path: '/venue', label: 'Venues', icon: FaVrCardboard },
  { path: '/visualization', label: 'Visualizations', icon: FaChartBar },
  { path: '/wishlist', label: 'Wishlist', icon: FaHeart },
];

const Breadcrumbs: React.FC = () => {
  const matches = useMatches();
  const crumbs = matches
    .filter(match => match.handle?.breadcrumb)
    .map(match => {
      const route = routes.find(r => match.pathname.startsWith(r.path));
      return {
        path: match.pathname,
        label: route?.label || match.handle?.breadcrumb,
        icon: route?.icon
      };
    });

  return (
    <nav aria-label="Breadcrumbs" className="py-2">
      <motion.ol 
        className="flex items-center space-x-2 text-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <li>
          <Link 
            to="/"
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <FaHome className="w-4 h-4" />
            <span className="ml-1">Home</span>
          </Link>
        </li>
        
        {crumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <Link
              to={crumb.path}
              className={`flex items-center transition-colors ${
                index === crumbs.length - 1
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              {crumb.icon && <crumb.icon className="w-4 h-4 mr-1" />}
              <span>{crumb.label}</span>
            </Link>
          </li>
        ))}
      </motion.ol>
    </nav>
  );
};

export default Breadcrumbs; 