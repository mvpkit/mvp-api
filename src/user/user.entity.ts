import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  street1: string;

  @Column({ nullable: true })
  street2: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  resetPasscode: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;
}

export class UserCreateDto {
  @IsEmail()
  email: string;

  @IsNotEmpty() @MinLength(8)
  password: string;

  firstName?: string;

  lastName?: string;
}

export class UserUpdateDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @MinLength(8)
  @IsOptional()
  password?: string;

  firstName?: string;

  lastName?: string;

  resetPasscode?: string;
}

export class UserLoginDto {
  @IsNotEmpty() @IsEmail()
  email: string;

  @IsNotEmpty() @MinLength(8)
  password: string;
}
export class UserResetPasswordDto {
  @IsNotEmpty() @IsEmail()
  email: string;
}

export class UserChoosePasswordDto {
  @IsNotEmpty()
  resetPasscode: string;

  @IsNotEmpty() @MinLength(8)
  password: string;
}
