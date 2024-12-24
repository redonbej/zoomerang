
import { IUserService, User } from "@/lib/interfaces";
import prisma from "@/lib/prisma";

export class UserService implements IUserService {
  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async createUser(user: User): Promise<User> {
    return prisma.user.create({ data: user });
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    return prisma.user.update({ where: { id }, data: user });
  }

  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}