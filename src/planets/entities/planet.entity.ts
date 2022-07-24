import {
  Column,
  Entity,
  Generated,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UpdatePlanetInput } from '../inputs/update-planet.input';
import { UsersPlanets } from './users-planets.entity';

@Entity('planets')
export class Planet {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uuid: string;

  @Index({ unique: true })
  @Column()
  name: string;

  @Column()
  bio: string;

  @Column()
  requirements: string;

  @Column()
  topics: string;

  @Column()
  public: boolean;

  @OneToMany(() => UsersPlanets, (userPlanets) => userPlanets.planet)
  users: UsersPlanets[];

  updateFields(planetInput: UpdatePlanetInput) {
    this.bio = planetInput.bio || this.bio;
    this.requirements = planetInput.requirements || this.requirements;
    this.topics = planetInput.topics || this.topics;
    this.public = planetInput.public || this.public;
  }
}
