import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uuid: string;

  @Column()
  content: string;

  @Column()
  authorId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author: User;

  @Column()
  recipient: string;

  @Column()
  toChannel: boolean;

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}
