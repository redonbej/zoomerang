import { AuthService } from "@/lib/interfaces";
import { JwtAuthService } from "@/lib/authService";
import { MockAuthService } from "@/lib/mockAuthService";

export function authServiceFactory(useMock: boolean): AuthService {
  return useMock ? new MockAuthService() : new JwtAuthService();
}
