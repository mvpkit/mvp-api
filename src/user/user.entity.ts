import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { DeleteDateColumn } from 'typeorm'


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column( { nullable: true })
  first_name: string;

  @Column( { nullable: true })
  last_name: string;

  @CreateDateColumn()
  created: Date;


  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date

}
