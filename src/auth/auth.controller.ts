import { UserLoginDto, UserResetPasswordDto } from './../user/user.entity';
import { Controller, Body, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate login', description: 'Authenticate user by email and password'  })
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password', description: 'Initiate user password reset and sends out an email with the passcode'  })
  async resetPassword(@Body() userResetPassword: UserResetPasswordDto) {
    return this.authService.resetPassword(userResetPassword);
  }

}
