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
  Res,
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
  async googleAuth(@Req() req) {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const userToken = await this.authService.loginGoogle(req);
      res.redirect(
        `${process.env.WEB_SSO_SUCCESS_URL}?accessToken=${userToken.accessToken}`,
      );
    } catch (err) {
      res.redirect(`${process.env.WEB_SSO_FAIL_URL}`);
    }
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req, @Res() res) {
    try {
      const userToken = await this.authService.loginFacebook(req);
      res.redirect(
        `${process.env.WEB_SSO_SUCCESS_URL}?accessToken=${userToken.accessToken}`,
      );
    } catch (err) {
      res.redirect(`${process.env.WEB_SSO_FAIL_URL}`);
    }
  }
}
