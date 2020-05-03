import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserLoginDto } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.userService.login(userLoginDto);
    if (user) {
      return {
        ...user,
        access_token: this.jwtService.sign({ user}),
      };
      throw new UnauthorizedException();
    }
  }
}
