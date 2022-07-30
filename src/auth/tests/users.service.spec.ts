import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersPlanets } from '../../planets/entities/users-planets.entity';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { BadRequestException } from '@nestjs/common';
import { UserInput } from '../inputs/user.input';

const mockUser = new User();
mockUser.username = 'Old Username';
mockUser.bio = 'Old Bio';
mockUser.email = 'Old Email';
mockUser.topics = 'Old Topics';

const mockUsersPlanet = new UsersPlanets();

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepo: any;
  let usersPlanetsRepo: any;

  const mockUsersRepository = () => ({
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  });
  const mockUsersPlanetsRepository = () => ({
    find: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(UsersPlanets),
          useFactory: mockUsersPlanetsRepository,
        },
      ],
    }).compile();

    usersService = module.get(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    usersPlanetsRepo = module.get(getRepositoryToken(UsersPlanets));
  });

  it('UsersService defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('getUsers', () => {
    it('return list of users', async () => {
      userRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await usersService.getUsers();

      expect(result.length).toEqual(2);
    });
  });

  describe('updateUser', () => {
    const userInput = new UserInput();
    userInput.username = 'New Username';
    userInput.bio = 'New Bio';
    userInput.email = 'New Email';
    userInput.topics = 'New Topics';

    it('user doesnt exist', async () => {
      userRepo.findOneBy.mockResolvedValue(null);

      expect(
        usersService.updateUser('userUuid', userInput),
      ).rejects.toThrowError(BadRequestException);
    });

    it('not updating with empty data', async () => {
      userRepo.findOneBy.mockResolvedValue(mockUser);

      const result = await usersService.updateUser('userUUid', new UserInput());

      expect(userRepo.save).toBeCalledTimes(0);
      expect(result.bio).toBe(mockUser.bio);
    });

    it('user updates', async () => {
      userRepo.findOneBy.mockResolvedValue(mockUser);
      userRepo.save.mockImplementationOnce((user: any) => user);

      const result = await usersService.updateUser('userUuid', userInput);

      expect(userRepo.save).toBeCalledTimes(1);
      expect(result).toEqual({
        bio: userInput.bio,
        topics: userInput.topics,
        username: userInput.username,
        email: userInput.email,
      });
    });
  });

  describe('findUserById', () => {
    it('return user', async () => {
      userRepo.findOneBy.mockResolvedValue(mockUser);

      const result = await usersService.findUserById('id');

      expect(result).toEqual(mockUser);
    });
  });

  describe('findUsersPlanet', () => {
    it('returns user planets', async () => {
      usersPlanetsRepo.find.mockResolvedValue(mockUsersPlanet);

      const result = await usersService.getUsersPlanet(mockUser);

      expect(result).toEqual(mockUsersPlanet);
    });
  });
});
