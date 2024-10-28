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

import { ModalProvider } from './providers/ModalProvider';
import { MusicProvider } from './contexts/music';
import { ErrorProvider } from './contexts/ErrorContext';
import { UserProvider } from './contexts/UserContext';
import { AudioProvider } from './contexts/AudioContext';

import MusicPlayerControls from './components/music/MusicPlayerControls';
import ErrorFallback from './components/common/ErrorFallback';
import theme from './styles/theme';

import toastStyles from 'react-toastify/dist/ReactToastify.css';
import tailwindStyles from './styles/tailwind.css';
import globalStyles from './styles/global.css';
import avatarStyles from "~/styles/avatar.css";

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

export const loader: LoaderFunction = async ({ request }) => {
  // Get initial state from cookies/session
  const session = await getSession(request.headers.get("Cookie"));
  
  return json({
    theme: {
      darkMode: session.get("darkMode") ?? false,
    },
    user: {
      preferences: {
        language: session.get("language") ?? "en",
      },
    },
  });
};

export function links() {
  return [
    { rel: 'stylesheet', href: tailwindStyles },
    { rel: 'stylesheet', href: toastStyles },
    { rel: 'stylesheet', href: globalStyles },
    { rel: 'stylesheet', href: avatarStyles },
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
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className={data.theme.darkMode ? "dark" : ""}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ModalProvider>
                <ErrorProvider>
                  <UserProvider>
                    <AudioProvider>
                      <MusicProvider>
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
                      </MusicProvider>
                    </AudioProvider>
                  </UserProvider>
                </ErrorProvider>
              </ModalProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </ErrorBoundary>
        <ScrollRestoration />
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
