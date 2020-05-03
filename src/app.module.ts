import * as dotenv from 'dotenv';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_TYPE as any,
      host: process.env.TYPEORM_HOST,
      port: process.env.TYPEORM_PORT as any,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts}'],
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
