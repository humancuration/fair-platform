import { json, LoaderFunction, ActionFunction } from '@remix-run/node';
import { VersionControlService } from '~/services/versionControl';

const versionControl = new VersionControlService();

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const entityId = url.searchParams.get('entityId');
  
  if (!entityId) {
    throw new Error('Entity ID is required');
  }

  const history = await versionControl.getVersionHistory(entityId);
  return json(history);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { entityId, entityType, changes, userId } = Object.fromEntries(formData);

  switch (request.method) {
    case 'POST':
      // Track new change
      return await versionControl.trackChange({
        entityId: entityId as string,
        entityType: entityType as any,
        changes: JSON.parse(changes as string),
        userId: userId as string,
      });

    case 'PUT':
      // Revert to version
      const versionId = formData.get('versionId') as string;
      return await versionControl.revertToVersion(entityId as string, versionId);

    default:
      throw new Error('Method not allowed');
  }
};
