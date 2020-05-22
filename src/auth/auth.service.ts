import { UserChoosePasswordDto } from './../user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserLoginDto, UserResetPasswordDto } from '../user/user.entity';
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

  async login(userLoginDto: UserLoginDto) {
    const user = await this.userService.login(userLoginDto);
    if (!user) throw new UnauthorizedException();

    return {
      ...user,
      accessToken: this.jwtService.sign({ user }),
    };
  }

  async resetPassword(userResetPasswordDto: UserResetPasswordDto) {
    const user = await this.userService.findByEmail(userResetPasswordDto.email);
    if (!user) throw new NotFoundException();
    if (user) {
      const resetPasscode =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      this.userService.update(user.id, { resetPasscode });
      this.sendResetPasswordEmail(user, resetPasscode);
      return { resetPasscode };
    }
  }

  async choosePassword(userChoosePasswordDto: UserChoosePasswordDto) {
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

  sendResetPasswordEmail(user, resetPasscode) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Forgot Password',
      text: `Forgot your password? Click here to reset it: http://${process.env.SITE_HOST}/reset-password?resetPasscode=${resetPasscode}`,
      html: `Click here to reset your password: <a href="http://${process.env.SITE_HOST}/reset-password?resetPasscode=${resetPasscode}">Reset Password</b>`,
    });
  }
}
