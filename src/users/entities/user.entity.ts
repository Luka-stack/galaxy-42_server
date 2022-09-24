import { UsersPlanets } from '../../planets/entities/users-planets.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserInput } from '../inputs/user.input';
import { Expose } from 'class-transformer';

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

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  topics: string;

  @Column({ nullable: true })
  imageUrn: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => UsersPlanets, (userPlanets) => userPlanets.user)
  planets: UsersPlanets[];

  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `${process.env.APP_URL}/profiles/${this.imageUrn}`
      : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  }

  updateFields(userInput: UserInput) {
    this.username = userInput.username || this.username;
    this.email = userInput.email || this.email;
    this.bio = userInput.bio || this.bio;
    this.topics = userInput.topics || this.topics;
  }
}
