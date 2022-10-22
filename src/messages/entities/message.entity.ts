import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Channel } from '../../channels/entities/channel.entity';
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

  @Column({ nullable: true })
  recipientUuid: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  recipient: User | null;

  @Column({ nullable: true })
  channelUuid: string | null;

  @ManyToOne(() => Channel, { onDelete: 'CASCADE', nullable: true })
  channel: Channel | null;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  insertLookUpFields() {
    this.recipientUuid = this.recipient?.uuid || null;
    this.channelUuid = this.channel?.uuid || null;
  }
}
