import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Planet } from '../../planets/entities/planet.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uuid: string;

  @Column()
  name: string;

  @ManyToOne(() => Planet, { onDelete: 'CASCADE' })
  planet: Planet;
}
