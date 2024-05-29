import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { IJwtPayload, Tokens } from './types';

import { SigninDto, SignupDto } from './dto/index.dto';
import { bCryptDecode, bCryptHash } from 'src/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const password = await bCryptHash(dto.password);
    const newUser = await this.prisma.user.create({
      data: { ...dto, password: password },
    });

    return {
      success: true,
      messsage: `Account for ${newUser.firstname} created.`,
    };
  }

  async signin(dto: SigninDto) {
    const user = await this.findUserByEmail(dto.email);

    const pMatches = await bCryptDecode(dto.password, user.password);

    if (!pMatches) throw new UnauthorizedException('Invalid Credentials');

    const tokens = await this.generateTokens({
      email: user.email,
      role: user.role,
      sub: user.id,
    });

    // exclude some fields
    const { password, updatedAt, createdAt, ...data } = user;

    return { tokens, data };
  }

  async signout(user: User) {
    return {};
  }

  //   helpers
  async findUserByEmail(email: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!foundUser) throw new NotFoundException('Account not found');
    return foundUser;
  }

  // generate refesh and access tokens
  async generateTokens(payload: IJwtPayload): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow('ACCESS_TOKEN_SECRET'),
        expiresIn: this.config.getOrThrow('ACCESS_TOKEN_EXPIRY'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow('REFRESH_TOKEN_SECRET'),
        expiresIn: this.config.getOrThrow('REFRESH_TOKEN_EXPIRY'),
      }),
    ]);

    return { accessToken: at, refreshToken: rt };
  }
}
