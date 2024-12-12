import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from '../entities/userAccount.entity';
import { RegisterUserDTO } from '../dto/registerUserDTO';
import * as bcrypt from 'bcrypt';

/**
 * Service responsible for managing user accounts.
 * Handles user creation, validation, and persistence in the database.
 */
@Injectable()
export class UserAccountsService {
  private readonly logger: Logger = new Logger(UserAccountsService.name);
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  /**
   * Creates a new user account.
   * @param userDto - Data Transfer Object containing user registration details.
   * @returns The ID of the newly created user.
   * @throws ConflictException - If a user with the provided email already exists.
   */
  async createUser(userDto: RegisterUserDTO): Promise<number> {
    const isUserExists: boolean = await this.userAccountRepository.existsBy({
      email: userDto.email,
    });

    if (isUserExists) {
      this.logger.error(`${userDto.email} already exists`);
      throw new ConflictException();
    }

    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(userDto.password, salt);

    const user = new UserAccount(
      userDto.firstname,
      userDto.lastname,
      userDto.email,
      hash,
      salt,
      'USER',
    );

    const savedUser: UserAccount = await this.userAccountRepository.save(user);
    this.logger.log(`new user with id ${savedUser.id} saved`);
    this.logger.debug(`${savedUser} saved successfully`);
    return savedUser.id;
  }
}
