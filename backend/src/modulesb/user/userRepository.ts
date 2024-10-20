import { User } from './userModel'; // Make sure this import is correct

export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async create(data: Partial<User>): Promise<User> {
    return await User.create(data as User);
  }

  async findById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const user = await User.findByPk(id);
    if (user) {
      return await user.update(data);
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await User.destroy({ where: { id } });
    return deletedCount > 0;
  }
}
