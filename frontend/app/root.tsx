import { 
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { json, type LoaderFunction } from '@remix-run/node';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { ErrorBoundary } from 'react-error-boundary';

import { StateProvider } from './store/store';
import { ModalProvider } from './providers/ModalProvider';
import { MusicPlayerProvider } from './contexts/music';
import { ErrorProvider } from './contexts/ErrorContext';
import { UserProvider } from './modules/user/UserContext';
import { UnifiedAudioProvider } from './contexts/audio';

import MusicPlayerControls from './components/music/MusicPlayerControls';
import ErrorFallback from './components/common/ErrorFallback';
import theme from './styles/theme';

import toastStyles from 'react-toastify/dist/ReactToastify.css';
import tailwindStyles from './styles/tailwind.css';
import globalStyles from './styles/global.css';

// Initialize QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000,   // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const loader: LoaderFunction = async () => {
  return json({
    ENV: {
      API_BASE_URL: process.env.API_BASE_URL,
      // Add other env variables that should be available client-side
    }
  });
};

export function links() {
  return [
    { rel: 'stylesheet', href: tailwindStyles },
    { rel: 'stylesheet', href: toastStyles },
    { rel: 'stylesheet', href: globalStyles },
  ];
}

export function meta() {
  return [
    { charset: 'utf-8' },
    { title: 'Fair Platform' },
    { viewport: 'width=device-width,initial-scale=1' },
  ];
}

export default function App() {
  const { ENV } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <StateProvider>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ModalProvider>
                  <ErrorProvider>
                    <UserProvider>
                      <UnifiedAudioProvider>
                        <MusicPlayerProvider>
                          <Outlet />
                          <ToastContainer 
                            position="top-right" 
                            autoClose={5000} 
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                          />
                          <MusicPlayerControls />
                        </MusicPlayerProvider>
                      </UnifiedAudioProvider>
                    </UserProvider>
                  </ErrorProvider>
                </ModalProvider>
              </ThemeProvider>
            </QueryClientProvider>
          </StateProvider>
        </ErrorBoundary>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// Error boundary for the whole app
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />
        <Scripts />
      </body>
    </html>
  );
}
