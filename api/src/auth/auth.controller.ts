import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CurrentUser, PublicRoute } from 'src/common';

import { SigninDto, SignupDto } from './dto/index.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tokens, data } = await this.authService.signin(dto);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'none',
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
    });

    return {
      ...data,
      token: tokens.accessToken,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  async signout(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: User,
  ) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return this.authService.signout(user);
  }
}
