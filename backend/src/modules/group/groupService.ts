import { GroupRepository, IGroupRepository } from './groupRepository';
import { Group } from './groupModel';
import { User } from '../user/userModel';

export class GroupService {
  private groupRepository: IGroupRepository;

  constructor(groupRepository: IGroupRepository = new GroupRepository()) {
    this.groupRepository = groupRepository;
  }

  async createGroup(groupData: Partial<Group>): Promise<Group> {
    return this.groupRepository.create(groupData);
  }

  async getGroupById(id: string): Promise<Group | null> {
    return this.groupRepository.findById(id);
  }

  async getAllGroups(): Promise<Group[]> {
    return this.groupRepository.findAll();
  }

  async addMemberToGroup(groupId: string, userId: string): Promise<Group | null> {
    const group = await this.groupRepository.findById(groupId);
    const user = await User.findByPk(userId);
    if (group && user) {
      await group.$add('members', user);
      return group.reload();
    }
    return null;
  }
}
