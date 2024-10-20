import { IUserRepository, UserRepository } from './userRepository';
import { User } from './userModel';

export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async createUser(data: Partial<User>): Promise<User> {
    return await this.userRepository.create(data);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    return await this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepository.delete(id);
  }
}
