import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
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
  @ApiProperty()
  @IsEmail()
  email: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @Column({ nullable: true })
  @ApiProperty()
  @IsOptional()
  firstName: string;

  @Column({ nullable: true })
  @ApiProperty()
  @IsOptional()
  lastName: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;
}

export class UserLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
