import { CrudModule } from './crud/crud.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
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
    MailerModule.forRoot({
      transport: process.env.SMTP_TRANSPORT, // SMTP_TRANSPORT=smtps://nobrainerlabs@gmail.com:secure1234@smtp.gmail.com
      defaults: {
        from: process.env.SMTP_FROM, // SMTP_FROM="Nobrainer Labs" <nobrainerlabs@gmail.com>
      }
    }),
    UserModule,
    AuthModule,
    CrudModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
