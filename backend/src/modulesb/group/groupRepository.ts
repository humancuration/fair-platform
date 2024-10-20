import { Group } from './groupModel';

export interface IGroupRepository {
  create(data: Partial<Group>): Promise<Group>;
  findById(id: string): Promise<Group | null>;
  findAll(): Promise<Group[]>;
  update(id: string, data: Partial<Group>): Promise<Group | null>;
  delete(id: string): Promise<boolean>;
}

export class GroupRepository implements IGroupRepository {
  async create(data: Partial<Group>): Promise<Group> {
    return await Group.create(data as Group);
  }

  async findById(id: string): Promise<Group | null> {
    return await Group.findByPk(id);
  }

  async findAll(): Promise<Group[]> {
    return await Group.findAll();
  }

  async update(id: string, data: Partial<Group>): Promise<Group | null> {
    const group = await Group.findByPk(id);
    if (group) {
      return await group.update(data);
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await Group.destroy({ where: { id } });
    return deletedCount > 0;
  }
}
