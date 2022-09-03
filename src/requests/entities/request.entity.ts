import { User } from '../../users/entities/user.entity';
import { Planet } from '../../planets/entities/planet.entity';
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

  @Column()
  userId: number;

  @Column()
  planetId: number;

  @ManyToOne(() => User, (user) => user.planets, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Planet, (planet) => planet.users, { onDelete: 'CASCADE' })
  planet: Planet;

  @Column({ nullable: true })
  content: string;

  @Column()
  viewed: boolean;

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}
