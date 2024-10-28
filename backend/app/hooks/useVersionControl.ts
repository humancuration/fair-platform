import { useFetcher } from '@remix-run/react';

export function useVersionControl() {
  const fetcher = useFetcher();

  const trackChange = async <T extends { id: string }>({
    entityId,
    entityType,
    changes,
    userId,
  }: {
    entityId: string;
    entityType: 'playlist' | 'product' | 'marketplace';
    changes: Partial<T>;
    userId: string;
  }) => {
    const formData = new FormData();
    formData.append('entityId', entityId);
    formData.append('entityType', entityType);
    formData.append('changes', JSON.stringify(changes));
    formData.append('userId', userId);

    fetcher.submit(formData, {
      method: 'POST',
      action: '/api/version-control'
    });
  };

  const revertToVersion = (entityId: string, versionId: string) => {
    const formData = new FormData();
    formData.append('entityId', entityId);
    formData.append('versionId', versionId);

    fetcher.submit(formData, {
      method: 'PUT',
      action: '/api/version-control'
    });
  };

  return {
    trackChange,
    revertToVersion,
    isLoading: fetcher.state === 'submitting'
  };
}
