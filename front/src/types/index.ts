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

export interface Workplace {
  id: number;
  name: string;
  salary: number;
  prefecture: string;
  city: string;
}

export interface CreateWorkplaceParams {
  name: string;
  salary: number;
  prefecture: string;
  city: string;
}

export interface WorkplaceResponse {
  workplace: Workplace;
}
