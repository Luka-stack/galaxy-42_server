import { Field } from '@nestjs/graphql';
import { User } from 'src/auth/entities/user.entity';
import { Planet } from 'src/planets/entities/planet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uuid: string;

  @Field()
  userId: string;

  @Field()
  planetId: string;

  @ManyToOne(() => User, (user) => user.planets, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Planet, (planet) => planet.users, { onDelete: 'CASCADE' })
  planet: Planet;

  @Field({ nullable: true })
  content: string;

  @Field()
  viewed: boolean;

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}
