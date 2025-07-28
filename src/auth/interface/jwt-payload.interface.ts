import { Role } from "../roles.enum";

export interface JwtPayload {
    email: string;
    sub: string;
    role?: Role;
    iat?: number;
    exp?: number;
  }
