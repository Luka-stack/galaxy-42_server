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

  @Column()
  useruuid: string; // Lookup field

  @Column()
  planetuuid: string; // Lookup field

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
