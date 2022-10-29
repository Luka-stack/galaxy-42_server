import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Planet } from '../../planets/entities/planet.entity';

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uuid: string;

  @Column()
  name: string;

  @Column()
  planetId: number;

  @ManyToOne(() => Planet, { onDelete: 'CASCADE' })
  planet: Planet;
}
