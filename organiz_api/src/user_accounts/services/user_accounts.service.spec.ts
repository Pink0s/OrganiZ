import { Test, TestingModule } from '@nestjs/testing';
import { UserAccountsService } from './user_accounts.service';
import { Repository } from 'typeorm';
import { UserAccount } from '../entities/user_account.entity';
import { RegisterUserDTO } from '../dto/registerUserDTO';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

describe('UserAccountsService', () => {
  let service: UserAccountsService;
  let repository: Repository<UserAccount>;

  beforeEach(async () => {
    const mockRepository = {
      existsBy: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAccountsService,
        {
          provide: getRepositoryToken(UserAccount),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserAccountsService>(UserAccountsService);
    repository = module.get<Repository<UserAccount>>(
      getRepositoryToken(UserAccount),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create_user', () => {
    it('should create and return the ID of a new user', async () => {
      const mockUserDTO: RegisterUserDTO = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'Strong-Password1',
      };

      jest.spyOn(repository, 'existsBy').mockResolvedValue(false);
      jest.spyOn(repository, 'save').mockResolvedValue({
        id: 1,
      } as UserAccount);

      const result = await service.create_user(mockUserDTO);

      expect(repository.existsBy).toHaveBeenCalledWith({
        email: mockUserDTO.email,
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          firstname: mockUserDTO.firstname,
          lastname: mockUserDTO.lastname,
          email: mockUserDTO.email,
        }),
      );
      expect(result).toBe(1);
    });

    it('should throw ConflictException if user already exists', async () => {
      const mockUserDTO: RegisterUserDTO = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'Strong-Password1',
      };

      jest.spyOn(repository, 'existsBy').mockResolvedValue(true);

      await expect(service.create_user(mockUserDTO)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.existsBy).toHaveBeenCalledWith({
        email: mockUserDTO.email,
      });
    });
  });
});
