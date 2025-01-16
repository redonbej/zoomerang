import { AuthService, User } from "@/lib/interfaces";

export class MockAuthService extends AuthService {
  private mockUsers: User[] = [
    { id: "1", name: "Jane Doe", email: "jane@example.com", password: "mockpassword" },
  ];

  async login(email: string, password: string): Promise<string> {
    const user = this.mockUsers.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid credentials");
    return "mock-token";
  }

  async register(user: User): Promise<void> {
    this.mockUsers.push(user);
  }

  async verifyToken(token: string): Promise<User | null> {
    if (token === "mock-token") return this.mockUsers[0];
    return null;
  }
}
