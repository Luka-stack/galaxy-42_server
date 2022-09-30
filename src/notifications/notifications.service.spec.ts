import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { Planet } from '../planets/entities/planet.entity';

describe('NotificationsService', () => {
  let notificationsService: NotificationsService;
  let notificationsRepo: any;

  const notificationRepoMock = () => ({
    find: jest.fn(),
    findBy: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useFactory: notificationRepoMock,
        },
      ],
    }).compile();

    notificationsService = module.get(NotificationsService);
    notificationsRepo = module.get(getRepositoryToken(Notification));
  });

  it('NotificationsService defined', () => {
    expect(notificationsService).toBeDefined();
  });

  // describe('getNotifications', () => {
  //   it('return list of notifications', async () => {
  //     notificationsRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);

  //     const result = await notificationsService.getNotifications();

  //     expect(result.length).toBe(2);
  //   });
  // });

  // describe('deleteNotification', () => {
  //   it('delets notifications', async () => {
  //     const deleted = new Notification();
  //     deleted.id = 1;

  //     notificationsRepo.findBy.mockResolvedValue([deleted]);
  //     notificationsRepo.remove.mockImplementationOnce((notify) => notify);

  //     const result = await notificationsService.deleteNotifications(['1']);

  //     expect(result.length).toBe(1);
  //     expect(result[0]).toBe(deleted);
  //   });
  // });

  describe('createNotification', () => {
    it('creates notification', async () => {
      const user = new User();
      user.id = 1;

      const planet = new Planet();
      planet.id = 2;

      const rejected = true;

      notificationsRepo.create.mockImplementationOnce((notify) => notify);
      notificationsRepo.save.mockImplementationOnce((notify) => notify);

      const result = await notificationsService.createNotification(
        user,
        planet,
        rejected,
      );

      expect(notificationsRepo.create).toBeCalledTimes(1);
      expect(notificationsRepo.create).toBeCalledTimes(1);
    });
  });
});
