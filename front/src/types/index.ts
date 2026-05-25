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

export interface UpdateWorkplaceParams extends CreateWorkplaceParams {
  id: number;
}

export interface WorkplaceResponse {
  workplace: Workplace;
}

export interface WorkplacesResponse {
  workplaces: Workplace[];
}

export interface Residence {
  id: number;
  name: string;
  rent: number;
  prefecture: string;
  city: string;
}

export interface CreateResidenceParams {
  name: string;
  rent: number;
  prefecture: string;
  city: string;
}

export interface UpdateResidenceParams extends CreateResidenceParams {
  id: number;
}

export interface ResidenceResponse {
  residence: Residence;
}

export interface ResidencesResponse {
  residences: Residence[];
}
