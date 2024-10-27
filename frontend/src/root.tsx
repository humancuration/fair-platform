import type { MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import AudioManager from '~/contexts/AudioManager';
import ErrorBoundary from '~/components/common/ErrorFallback';
// Import other global styles and providers as needed

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Fair Platform',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <AudioManager sounds={[/* your sounds here */]} />
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  // Implement CatchBoundary using ErrorFallback if desired
  return <ErrorBoundary error={new Error("Not Found")} />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorFallback error={error} resetErrorBoundary={() => { /* reset logic */ }} />;
}
