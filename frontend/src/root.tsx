import { StateProvider } from './store/store';
import { FC, ReactNode } from 'react';

const App: FC = () => {
  return (
    <StateProvider>
      <AppContent />
    </StateProvider>
  );
};

const AppContent: FC = () => {
  return (
    <div>
      {/* Your app components */}
    </div>
  );
};

export default App;
