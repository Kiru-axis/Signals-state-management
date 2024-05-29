import { Role } from '@prisma/client';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export interface IJwtPayload {
  sub: string;
  email: string;
  role: Role;
}
