import { AuthService, User } from "@/lib/interfaces";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class JwtAuthService extends AuthService {
  async login(email: string, password: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
  }

  async register(user: User): Promise<void> {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    await prisma.user.create({ data: { ...user, password: hashedPassword } });
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string };
      return prisma.user.findUnique({ where: { id: decoded.id } });
    } catch {
      return null;
    }
  }
}