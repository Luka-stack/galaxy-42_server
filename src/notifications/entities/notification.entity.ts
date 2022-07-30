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

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uuid: string;

  @Column()
  rejected: boolean;

  @Column()
  viewed: boolean;

  @Column()
  userId: number;

  @Column()
  planetId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Planet, { onDelete: 'CASCADE' })
  planet: Planet;

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}
