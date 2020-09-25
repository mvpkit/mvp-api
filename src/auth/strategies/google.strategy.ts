import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable, UnauthorizedException } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const options = {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.GOOGLE_CALLBACK_URL}`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    };

    super(
      options,
      async (
        req: any,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
      ): Promise<void> => {
        console.log('req query', req.url);

        const { name, emails, photos } = profile;
        const user = {
          email: emails[0].value,
          firstName: name.givenName,
          lastName: name.familyName,
          picture: photos[0].value,
          accessToken,
        };

        if (user === undefined) {
          done(new UnauthorizedException());
        }

        done(undefined, user);
      },
    );
  }
}
