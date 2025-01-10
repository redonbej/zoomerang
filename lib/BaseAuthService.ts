import { AuthService, User } from "@/lib/interfaces";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export class BaseAuthService extends AuthService {
  async login(email: string, password: string): Promise<string> {
    throw new Error("Login method must be implemented in a derived class");
  }

  async register(user: User): Promise<void> {
    throw new Error("Register method must be implemented in a derived class");
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string };
      return prisma.user.findUnique({ where: { id: decoded.id } });
    } catch (error) {
      console.error("Error verifying token:", error);
      return null;
    }
  }
}
