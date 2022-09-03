import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Planet } from '../entities/planet.entity';
import { UserRole } from '../entities/user-role';
import { UsersPlanets } from '../entities/users-planets.entity';
import { UsersPlanetsService } from '../services/users-planets.service';

describe('UsersPlanetsService', () => {
  let usersPlanetsService: UsersPlanetsService;
  let usersPlanetsRepo: any;

  const usersPlanetsRepoMock = () => ({
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersPlanetsService,
        {
          provide: getRepositoryToken(UsersPlanets),
          useFactory: usersPlanetsRepoMock,
        },
      ],
    }).compile();

    usersPlanetsService = module.get(UsersPlanetsService);
    usersPlanetsRepo = module.get(getRepositoryToken(UsersPlanets));
  });

  it('UsersPlanetsService defined', () => {
    expect(usersPlanetsService).toBeDefined();
  });

  describe('getPlanetsUser', () => {
    it('returns all planets users', async () => {
      usersPlanetsRepo.find.mockResolvedValue([
        { role: 'ADMIN' },
        { role: 'USER' },
      ]);

      const users = await usersPlanetsService.getPlanetsUser(new Planet());

      expect(users.length).toEqual(2);
    });
  });

  describe('createRelation', () => {
    it('creates a realtion', async () => {
      usersPlanetsRepo.create.mockImplementationOnce((relation) => relation);
      usersPlanetsRepo.save.mockImplementationOnce((relation) => relation);

      const user = new User();
      user.id = 1;

      const planet = new Planet();
      planet.id = 2;

      const role = UserRole.ADMIN;

      const result = await usersPlanetsService.createRelation(
        user,
        planet,
        role,
      );

      expect(result.role).toEqual(role);
      expect(result.userId).toEqual(user.id);
      expect(result.planetId).toEqual(planet.id);
    });
  });
});
