export interface AuthUser {
  id: number;
  name: string;
  provider: string;
  guest: boolean;
}

export interface AuthResponse {
  authenticated: boolean;
  user: AuthUser | null;
}

export interface GuestLoginParams {
  name?: string;
}
