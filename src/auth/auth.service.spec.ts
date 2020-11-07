import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from './../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './../user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: process.env.DB_TYPE as any,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT as any,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [__dirname + '/**/*.entity{.ts}'],
          synchronize: true,
          logging: true,
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
        }),
        UserModule,
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRATION },
        }),
        MailerModule.forRoot({
          transport: process.env.SMTP_TRANSPORT, // SMTP_TRANSPORT=smtps://nobrainerlabs@gmail.com:secure1234@smtp.gmail.com
          defaults: {
            from: process.env.SMTP_FROM, // SMTP_FROM="Nobrainer Labs" <nobrainerlabs@gmail.com>
          },
        }),
      ],
      providers: [AuthService, UserService, PassportModule, JwtModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
