import { PrismaClient, User } from '@prisma/client';

export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  private prisma = new PrismaClient();

  async create(data: Partial<User>): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return await this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<boolean> {
    const deletedUser = await this.prisma.user.delete({ where: { id } });
    return !!deletedUser;
  }
}
