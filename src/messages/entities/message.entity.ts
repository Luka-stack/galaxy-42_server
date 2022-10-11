import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Group } from '../../groups/entities/group.entity';
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

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  to: User | null;

  @ManyToOne(() => Group, { onDelete: 'CASCADE', nullable: true })
  group: Group | null;

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}
