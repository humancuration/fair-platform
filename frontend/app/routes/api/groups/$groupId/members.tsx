import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { GroupRepository } from '~/services/groups/GroupRepository';
import { GroupService } from '~/services/groups/GroupService';
import { z } from 'zod';

const groupRepository = new GroupRepository();
const groupService = new GroupService(groupRepository);

// Define validation schema for member actions
const memberActionSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['ADMIN', 'MODERATOR', 'MEMBER', 'OBSERVER']).optional(),
});

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  const { groupId } = params;

  if (!groupId) {
    return json({ error: 'Group ID is required' }, { status: 400 });
  }

  const group = await groupRepository.findById(groupId);
  if (!group) {
    return json({ error: 'Group not found' }, { status: 404 });
  }

  return json({ members: group.members });
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  const { groupId } = params;

  if (!groupId) {
    return json({ error: 'Group ID is required' }, { status: 400 });
  }

  const group = await groupRepository.findById(groupId);
  if (!group) {
    return json({ error: 'Group not found' }, { status: 404 });
  }

  const formData = await request.formData();
  const actionType = formData.get('_action');

  if (!actionType) {
    return json({ error: 'Action type is required' }, { status: 400 });
  }

  switch (actionType) {
    case 'add':
      {
        const parseResult = memberActionSchema.safeParse(Object.fromEntries(formData.entries()));
        if (!parseResult.success) {
          return json({ error: 'Invalid data', details: parseResult.error.flatten() }, { status: 400 });
        }

        const { userId, role } = parseResult.data;
        const result = await groupService.addMember(groupId, user.id, userId, role);

        if (!result.success) {
          return json({ error: result.error }, { status: 500 });
        }

        return json({ member: result.data });
      }

    case 'remove':
      {
        const userId = formData.get('userId');
        if (typeof userId !== 'string') {
          return json({ error: 'Invalid user ID' }, { status: 400 });
        }

        const result = await groupService.removeMember(groupId, user.id, userId);

        if (!result.success) {
          return json({ error: result.error }, { status: 500 });
        }

        return json({ message: 'Member removed successfully' });
      }

    case 'updateRole':
      {
        const parseResult = memberActionSchema.safeParse(Object.fromEntries(formData.entries()));
        if (!parseResult.success) {
          return json({ error: 'Invalid data', details: parseResult.error.flatten() }, { status: 400 });
        }

        const { userId, role } = parseResult.data;
        const result = await groupService.updateMemberRole(groupId, user.id, userId, role!);

        if (!result.success) {
          return json({ error: result.error }, { status: 500 });
        }

        return json({ member: result.data });
      }

    default:
      return json({ error: 'Invalid action type' }, { status: 400 });
  }
};

export default function GroupMembersRoute() {
  // This route handles API requests and does not render a UI
  return null;
}
