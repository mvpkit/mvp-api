import { Body, Controller, Post, Request, UseGuards, HttpCode } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { UserChoosePasswordDto, UserLoginDto, UserResetPasswordDto } from '../user/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate login', description: 'Authenticate user by email and password'  })
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password', description: 'Initiate user password reset and sends out an email with the passcode'  })
  async resetPassword(@Body() userResetPassword: UserResetPasswordDto) {
    return this.authService.resetPassword(userResetPassword);
  }

  @Post('choose-password')
  @ApiOperation({ summary: 'Choose a user password', description: 'Sets user password with a new one'  })
  async choosePassword(@Body() userChoosePassword: UserChoosePasswordDto) {
    return this.authService.choosePassword(userChoosePassword);
  }

}
