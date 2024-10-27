import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { GroupRepository } from '~/services/groups/GroupRepository';
import { GroupService } from '~/services/groups/GroupService';
import type { GroupCreateInput } from '~/types/group';
import { z } from 'zod';

const groupRepository = new GroupRepository();
const groupService = new GroupService(groupRepository);

// Define validation schema using Zod
const groupCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  groupTypeId: z.number(),
  categoryBadge: z.string().optional(),
  profilePicture: z.string().optional(),
  settings: z.object({
    isPublic: z.boolean(),
    allowNewMembers: z.boolean(),
    membershipCriteria: z.array(z.string()).optional(),
  }),
});

export const loader: LoaderFunction = async ({ request }) => {
  // For GET requests: Fetch all groups or a specific group
  const url = new URL(request.url);
  const groupId = url.searchParams.get('id');

  if (groupId) {
    const group = await groupRepository.findById(groupId);
    if (!group) {
      return json({ error: 'Group not found' }, { status: 404 });
    }
    return json({ group });
  }

  const groups = await groupRepository.findAll();
  return json({ groups });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const formData = await request.formData();
  const actionType = formData.get('_action');

  if (actionType === 'create') {
    const rawData = Object.fromEntries(formData.entries());
    const parseResult = groupCreateSchema.safeParse(rawData);

    if (!parseResult.success) {
      return json({ error: 'Invalid data', details: parseResult.error.flatten() }, { status: 400 });
    }

    const groupCreateInput: GroupCreateInput = parseResult.data;
    const result = await groupService.createGroup(groupCreateInput, user.id);

    if (!result.success) {
      return json({ error: result.error }, { status: 500 });
    }

    return redirect(`/api/groups?id=${result.data.id}`);
  }

  // Handle other action types (e.g., update, delete)

  return json({ error: 'Invalid action' }, { status: 400 });
};

export default function GroupsRoute() {
  // This route handles API requests and does not render a UI
  return null;
}
