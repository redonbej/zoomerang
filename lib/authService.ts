import { authServiceFactory } from "@/lib/authServiceFactory";

// Set this value to true for MockAuthService or false for JwtAuthService
const useMock = false;
const authService = authServiceFactory(useMock);

export { authService };
