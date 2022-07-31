import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { NotificationsService } from '../notifications/notifications.service';
import { UsersPlanetsService } from '../planets/services/users-planets.service';
import { RequestsService } from '../requests/requests.service';
import { Request } from '../requests/entities/request.entity';
import { Planet } from '../planets/entities/planet.entity';
import { User } from '../auth/entities/user.entity';
import { RequestInput } from './inputes/request.input';
import { UsersPlanets } from '../planets/entities/users-planets.entity';

describe('RequestsService', () => {
  let requestsService: RequestsService;
  let notificationsService: any;
  let usersPlanetsService: any;
  let requestsRepo: any;
  let planetsRepo: any;
  let usersRepo: any;

  const notificationsServiceMock = () => ({
    createNotification: jest.fn(),
  });
  const usersPlanetsServiceMock = () => ({
    createRelation: jest.fn(),
  });
  const requestsRepoMock = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  });
  const planetsRepoMock = () => ({
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  });
  const usersRepoMock = () => ({
    findOneBy: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: NotificationsService,
          useFactory: notificationsServiceMock,
        },
        {
          provide: UsersPlanetsService,
          useFactory: usersPlanetsServiceMock,
        },
        {
          provide: getRepositoryToken(Request),
          useFactory: requestsRepoMock,
        },
        {
          provide: getRepositoryToken(Planet),
          useFactory: planetsRepoMock,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: usersRepoMock,
        },
      ],
    }).compile();

    requestsService = module.get(RequestsService);
    notificationsService = module.get(NotificationsService);
    usersPlanetsService = module.get(UsersPlanetsService);
    requestsRepo = module.get(getRepositoryToken(Request));
    planetsRepo = module.get(getRepositoryToken(Planet));
    usersRepo = module.get(getRepositoryToken(User));
  });

  it('RequestService defined', () => {
    expect(requestsService).toBeDefined();
  });

  describe('getRequests', () => {
    it('returns requests', async () => {
      requestsRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await requestsService.getRequests(
        'planetUUid',
        'userUuid',
      );

      expect(result.length).toEqual(2);
    });
  });

  describe('createRequest', () => {
    it('planet not found', async () => {
      planetsRepo.findOne.mockResolvedValue(null);

      expect(
        requestsService.createRequest('userUUid', new RequestInput()),
      ).rejects.toThrowError(NotFoundException);
    });

    it('user already belongs to this planet', async () => {
      const user = new User();
      user.id = 1;

      const usersPlanets = new UsersPlanets();
      usersPlanets.userId = 1;

      const planet = new Planet();
      planet.users = [usersPlanets];

      planetsRepo.findOne.mockResolvedValue(planet);
      usersRepo.findOneBy.mockResolvedValue(user);

      expect(
        requestsService.createRequest('userUuid', new RequestInput()),
      ).rejects.toThrowError(BadRequestException);
    });

    it('creates request', async () => {
      const user = new User();
      user.id = 1;

      const planet = new Planet();
      planet.uuid = 'uuid';
      planet.users = [];

      planetsRepo.findOne.mockResolvedValue(planet);
      usersRepo.findOneBy.mockResolvedValue(user);
      requestsRepo.create.mockImplementationOnce((req) => req);
      requestsRepo.save.mockImplementationOnce((req) => req);

      const userUuid = 'User UUID';
      const requestInput = new RequestInput();
      requestInput.content = 'Test Content';

      const result = await requestsService.createRequest(
        userUuid,
        requestInput,
      );

      expect(result.content).toEqual(requestInput.content);
      expect(result.planetuuid).toEqual(planet.uuid);
      expect(result.useruuid).toEqual(userUuid);
      expect(result.viewed).toEqual(false);
    });
  });

  describe('resolveRequest', () => {
    it('request not found', async () => {
      requestsRepo.findOne.mockResolvedValue(null);

      expect(
        requestsService.resolveRequest('requestUuid', true),
      ).rejects.toThrowError(NotFoundException);
    });

    it('rejected, creates not relation, creates notification', async () => {
      const request = new Request();
      request.id = 1;
      request.user = new User();
      request.planet = new Planet();

      requestsRepo.findOne.mockResolvedValue(request);
      requestsRepo.remove.mockImplementationOnce((req) => req);

      const result = await requestsService.resolveRequest('requestUuid', true);

      expect(result.id).toEqual(request.id);
      expect(usersPlanetsService.createRelation).toBeCalledTimes(0);
      expect(notificationsService.createNotification).toBeCalledTimes(1);
    });

    it('accepted, creates relation, creates notification', async () => {
      const request = new Request();
      request.id = 1;
      request.user = new User();
      request.planet = new Planet();

      requestsRepo.findOne.mockResolvedValue(request);
      requestsRepo.remove.mockImplementationOnce((req) => req);

      const result = await requestsService.resolveRequest('requestUuid', false);

      expect(result.id).toEqual(request.id);
      expect(usersPlanetsService.createRelation).toBeCalledTimes(1);
      expect(notificationsService.createNotification).toBeCalledTimes(1);
    });
  });

  describe('getPlanetByUuid', () => {
    it('returns planet', async () => {
      planetsRepo.findOneBy.mockResolvedValue(new Planet());

      const result = await requestsService.getPlanetByUuid('planetUuid');

      expect(result).not.toBeNull();
    });
  });

  describe('getUserByUuid', () => {
    it('returns planet', async () => {
      usersRepo.findOneBy.mockResolvedValue(new User());

      const result = await requestsService.getUserByUuid('userUuid');

      expect(result).not.toBeNull();
    });
  });
});
