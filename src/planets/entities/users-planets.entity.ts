import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Planet } from './planet.entity';
import { UserRole } from './user-role';

@Entity('users_planets')
export class UsersPlanets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  planetId: number;

  @Column()
  role: UserRole;

  @ManyToOne(() => User, (user) => user.planets)
  user: User;

  @ManyToOne(() => Planet, (planet) => planet.users, { onDelete: 'CASCADE' })
  planet: Planet;
}
