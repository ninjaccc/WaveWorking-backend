import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { UserGooglePayload } from '../auth.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.OAUTH2_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH2_GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.OAUTH2_GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: unknown,
    done: (err: null | Error, data: object | UserGooglePayload) => void,
  ) {
    const { displayName, emails } = profile as {
      displayName: string;
      emails: { value: string };
    };

    const user: UserGooglePayload = {
      accessToken,
      refreshToken,
      email: emails[0].value,
      name: displayName,
    };

    done(null, user);
  }
}
