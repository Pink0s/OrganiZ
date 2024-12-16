import { Test, TestingModule } from '@nestjs/testing';
import { UserAccountsController } from './userAccounts.controller';
import { UserAccountsService } from '../services/userAccounts.service';
import { RegisterUserDTO } from '../dto/registerUserDTO';

describe('UserAccountsController', () => {
  let controller: UserAccountsController;
  let service: UserAccountsService;

  beforeEach(async () => {
    const mockService = {
      createUser: jest.fn().mockResolvedValue(1),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAccountsController],
      providers: [
        {
          provide: UserAccountsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserAccountsController>(UserAccountsController);
    service = module.get<UserAccountsService>(UserAccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register a user and return a success response', async () => {
      const mockRequest: any = {
        method: 'POST',
        url: '/users/register',
      };
      const mockData: RegisterUserDTO = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'Strong-Password1',
      };

      const result = await controller.registerUser(mockRequest, mockData);

      expect(result).toEqual({ id: 1 });
      expect(service.createUser).toHaveBeenCalledWith(mockData);
    });
  });
});
