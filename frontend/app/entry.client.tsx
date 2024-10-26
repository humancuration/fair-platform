import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { ClientProvider } from '@mantine/remix';

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ClientProvider>
        <RemixBrowser />
      </ClientProvider>
    </StrictMode>
  );
});
