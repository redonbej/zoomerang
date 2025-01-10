import { BaseAuthService } from "@/lib/BaseAuthService";
import { User } from "@/lib/interfaces";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class JwtAuthService extends BaseAuthService {
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

}
