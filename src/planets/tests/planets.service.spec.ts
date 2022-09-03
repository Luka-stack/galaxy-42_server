import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { Planet } from '../entities/planet.entity';
import { PlanetInput } from '../inputs/planet.input';
import { UpdatePlanetInput } from '../inputs/update-planet.input';
import { PlanetsService } from '../services/planets.service';
import { UsersPlanetsService } from '../services/users-planets.service';

// TODO: remove after implementing auth
const userMock = new User();
userMock.username = 'Mock User';

describe('PlanetsService', () => {
  let planetsService: PlanetsService;
  let planetsRepo: any;
  let usersPlanetsService: any;
  let usersService: any;

  const mockPlanetsRepo = () => ({
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  });
  const mockUsersPlanetsService = () => ({
    createRelation: jest.fn(),
    getPlanetsUser: jest.fn(),
  });
  const mockUsersService = () => ({
    findUserById: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PlanetsService,
        {
          provide: UsersPlanetsService,
          useFactory: mockUsersPlanetsService,
        },
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
        {
          provide: getRepositoryToken(Planet),
          useFactory: mockPlanetsRepo,
        },
      ],
    }).compile();

    planetsService = module.get(PlanetsService);
    planetsRepo = module.get(getRepositoryToken(Planet));
    usersPlanetsService = module.get(UsersPlanetsService);
    usersService = module.get(UsersService);
  });

  it('PlanetsService defined', () => {
    expect(planetsService).toBeDefined();
  });

  describe('getPlanets', () => {
    it('return list of planets', async () => {
      planetsRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await planetsService.getPlanets();

      expect(result.length).toEqual(2);
    });
  });

  describe('createPlanet', () => {
    it('name has to be unique', async () => {
      usersService.findUserById.mockResolvedValue(userMock);
      planetsRepo.findOneBy.mockResolvedValue({});

      expect(
        planetsService.createPlanet('userUuid', new PlanetInput()),
      ).rejects.toThrowError(BadRequestException);
    });

    it('creates planet', async () => {
      usersService.findUserById.mockResolvedValue(userMock);
      planetsRepo.findOneBy.mockResolvedValue(null);
      planetsRepo.create.mockImplementationOnce((planet) => planet);
      planetsRepo.save.mockImplementationOnce((planet) => planet);

      const planetInput = new PlanetInput();
      planetInput.name = 'Test Planet';

      const result = await planetsService.createPlanet('userUuid', planetInput);

      expect(result).toEqual(planetInput);
    });
  });

  describe('deletePlanet', () => {
    it('planet not found', async () => {
      planetsRepo.findOneBy.mockResolvedValue(null);

      expect(planetsService.deletePlanet('uuid')).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('planet deleted', async () => {
      planetsRepo.findOneBy.mockResolvedValue({});

      const result = await planetsService.deletePlanet('uuid');

      expect(result).toBeTruthy();
    });
  });

  describe('updatePlanet', () => {
    it('planet not found', async () => {
      planetsRepo.findOneBy.mockResolvedValue(null);

      expect(
        planetsService.updatePlanet('uuid', new UpdatePlanetInput()),
      ).rejects.toThrowError(NotFoundException);
    });

    it('planet updated', async () => {
      const planet = new Planet();
      planet.bio = 'Old Bio';
      planet.requirements = 'Old Reqs';
      planet.topics = 'Old Topics';
      planet.isPublic = true;

      planetsRepo.findOneBy.mockResolvedValue(planet);
      planetsRepo.save.mockImplementationOnce((planet) => planet);

      const planetInput = new UpdatePlanetInput();
      planetInput.bio = 'New Bio';
      planetInput.isPublic = false;
      planetInput.requirements = 'New Reqs';
      planetInput.topics = 'new Topics';

      const result = await planetsService.updatePlanet(
        'planetUuid',
        planetInput,
      );

      expect(result).toEqual(planetInput);
    });
  });

  describe('getPlanetsUser', () => {
    it('returns planets user', async () => {
      usersPlanetsService.getPlanetsUser.mockResolvedValue([
        { role: 'ADMIN' },
        { role: 'USER' },
      ]);

      const result = await planetsService.getPlanetsUser(new Planet());

      expect(result.length).toBe(2);
    });
  });

  describe('getPlanetById', () => {
    it('return planet', async () => {
      planetsRepo.findOneBy.mockResolvedValue(new Planet());

      const result = await planetsService.getPlanetById(1);

      expect(result).not.toBeNull();
    });
  });
});
