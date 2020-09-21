import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import {
  UserChoosePasswordDto,
  UserLoginDto,
  UserForgotPasswordDto,
} from '../user/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Authenticate login',
    description: 'Authenticate user by email and password',
  })
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot password request',
    description:
      'Initiate reset password and sends out a reset password email to the user',
  })
  async forgotPassword(@Body() userForgotPassword: UserForgotPasswordDto) {
    return this.authService.forgotPassword(userForgotPassword);
  }

  @Post('choose-password')
  @ApiOperation({
    summary: 'Choose a user password',
    description: 'Sets user password with a new one',
  })
  async choosePassword(@Body() userChoosePassword: UserChoosePasswordDto) {
    return this.authService.choosePassword(userChoosePassword);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.loginGoogle(req);
  }
}
