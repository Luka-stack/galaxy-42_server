import { UsersPlanets } from 'src/planets/entities/users-planets.entity';
import {
  Column,
  Entity,
  Generated,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserInput } from '../inputs/user.input';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uuid: string;

  @Index({ unique: true })
  @Column()
  username: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  topics: string;

  @OneToMany(() => UsersPlanets, (userPlanets) => userPlanets.user)
  planets: UsersPlanets[];

  updateFields(userInput: UserInput) {
    this.username = userInput.username || this.username;
    this.email = userInput.email || this.email;
    this.bio = userInput.bio || this.bio;
    this.topics = userInput.topics || this.topics;
  }
}
