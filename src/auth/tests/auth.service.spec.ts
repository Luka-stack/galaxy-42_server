import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { LoginInput } from '../inputs/login.input';
import { RegisterInput } from '../inputs/register.input';
import { AuthService } from '../services/auth.service';

const mockUser = new User();
mockUser.email = 'UserEmail';
mockUser.password =
  '$2b$06$luup68B6qsjz7ewcs8TW6OMLpFuud9Noz84VHX8krBexvGt/eubEK';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepo: any;

  const mockUsersRepository = () => ({
    findOneBy: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUsersRepository,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersRepo = module.get(getRepositoryToken(User));
  });

  it('AuthService defined', () => {
    expect(authService).toBeDefined();
  });

  describe('logIn', () => {
    it('wrong email', () => {
      usersRepo.findOneBy.mockResolvedValue(null);

      expect(authService.logIn(new LoginInput())).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('wrong password', () => {
      usersRepo.findOneBy.mockResolvedValue(mockUser);

      const loginInput = new LoginInput();
      loginInput.email = 'Email';
      loginInput.password = 'qwerty';

      expect(authService.logIn(loginInput)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('log in user', async () => {
      usersRepo.findOneBy.mockResolvedValue(mockUser);

      const loginInput = new LoginInput();
      loginInput.email = 'Email';
      loginInput.password = '1234567';

      const result = await authService.logIn(loginInput);

      expect(result).toEqual(mockUser);
    });
  });

  describe('register', () => {
    it('email and username in use', () => {
      usersRepo.count.mockResolvedValue(1);

      const registerInput = new RegisterInput();
      registerInput.email = 'New Email';
      registerInput.password = '1234567';
      registerInput.username = 'New Username';

      expect(authService.register(registerInput)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('creates user', async () => {
      usersRepo.count.mockResolvedValue(0);
      usersRepo.create.mockImplementationOnce((user) => user);
      usersRepo.save.mockImplementationOnce((user) => user);

      const password = '1234567';

      const registerInput = new RegisterInput();
      registerInput.password = password;

      const result = await authService.register(registerInput);

      expect(result.password).not.toEqual(password);
      expect(result.password.length).toBeGreaterThanOrEqual(60);
    });
  });
});
