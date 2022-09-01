import { Expose } from 'class-transformer';
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
  isPublic: boolean;

  @Column({ nullable: true })
  imageUrn: string;

  @OneToMany(() => UsersPlanets, (userPlanets) => userPlanets.planet)
  users: UsersPlanets[];

  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `${process.env.APP_URL}/planets/${this.imageUrn}`
      : 'https://picsum.photos/900/400';
  }

  updateFields(planetInput: UpdatePlanetInput) {
    this.bio = planetInput.bio || this.bio;
    this.requirements = planetInput.requirements || this.requirements;
    this.topics = planetInput.topics || this.topics;
    this.isPublic =
      planetInput.isPublic !== undefined ? planetInput.isPublic : this.isPublic;
  }
}
