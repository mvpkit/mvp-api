import { User, UserChoosePasswordDto } from './../user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  UserLoginDto,
  UserForgotPasswordDto,
  UserTokenDto,
} from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(username);

    if (!user) throw new NotFoundException();

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(userLoginDto: UserLoginDto): Promise<UserTokenDto> {
    const user = await this.userService.login(userLoginDto);
    if (!user) throw new UnauthorizedException();
    const accessToken = await this.generateAccessToken(user);
    return {
      user,
      accessToken,
      expiresIn: process.env.JWT_EXPIRATION,
    };
  }

  async forgotPassword(
    userForgotPasswordDto: UserForgotPasswordDto,
  ): Promise<void> {
    const user = await this.userService.findByEmail(
      userForgotPasswordDto.email,
    );
    if (!user) throw new NotFoundException();
    if (user) {
      const accessToken = await this.generateAccessToken(user);
      return accessToken;
    }
  }

  async choosePassword(
    userChoosePasswordDto: UserChoosePasswordDto,
  ): Promise<User> {
    Logger.log('choosing password');
    const user = await this.userService.findOne({
      where: { resetPasscode: userChoosePasswordDto.resetPasscode },
    });
    if (!user) throw new NotFoundException();
    return await this.userService.update(user.id, {
      password: userChoosePasswordDto.password,
      resetPasscode: null,
    });
  }

  async sendResetPasswordEmail(user: User, accessToken: string): Promise<void> {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Forgot Password',
      text: `Forgot your password? Click here to reset it: http://${process.env.SITE_HOST}/reset-password?token=${accessToken}`,
      html: `Click here to reset your password: <a href="http://${process.env.SITE_HOST}/reset-password?token=${accessToken}">Reset Password</b>`,
    });
  }

  async generateAccessToken(user: User): Promise<string> {
    return this.jwtService.sign(
      { user: { id: user.id } },
      { expiresIn: process.env.JWT_EXPIRATION },
    );
  }
}
