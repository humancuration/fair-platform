import { json } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { GroupService } from './groupService';
import { GroupRepository } from './groupRepository';
import { groupSchema } from '../../../../backup/models/groupModel';
import { requireUser } from '~/utils/session.server';

const groupService = new GroupService(new GroupRepository());

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  const { groupId } = params;

  if (groupId) {
    const group = await groupService.getGroupById(groupId);
    if (!group) {
      throw new Response('Not Found', { status: 404 });
    }
    return json({ group });
  }

  const groups = await groupService.getAllGroups();
  return json({ groups });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const formData = await request.formData();
  
  if (request.method === 'POST') {
    const data = Object.fromEntries(formData);
    const validated = groupSchema.safeParse(data);
    
    if (!validated.success) {
      return json({ errors: validated.error.flatten() }, { status: 400 });
    }

    const result = await groupService.createGroup(validated.data, user.id);
    if (!result.success) {
      return json({ error: result.error }, { status: 400 });
    }

    return json(result.data);
  }

  // Handle other methods...
  return json({ error: 'Method not allowed' }, { status: 405 });
};
