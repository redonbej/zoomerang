import { IRepository, User } from "@/lib/interfaces";
import prisma from "@/lib/prisma";

export class UserRepository implements IRepository<User> {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async create(user: User): Promise<User> {
    return prisma.user.create({ data: user });
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    return prisma.user.update({ where: { id }, data: user });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}