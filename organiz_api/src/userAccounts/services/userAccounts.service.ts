import {
  ConflictException,
  Injectable,
  Logger, NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from '../entities/userAccount.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from '../dto/loginUserDTO';
import { SignInResponseDto } from '../dto/signInResponseDTO';
import { RegisterUserDTO } from '../dto/registerUserDTO';
import { JwtService } from '@nestjs/jwt';

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
    private jwtService: JwtService,
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

  /**
   * Checks if a user exists in the repository by their email.
   *
   * @private
   * @param {string} email - The email address of the user to check.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the user exists, otherwise `false`.
   */
  async #isUserExists(email: string): Promise<boolean> {
    return this.userAccountRepository.existsBy({
      email: email,
    });
  }

  /**
   * Handles the sign-in process for a user.
   *
   * @param {LoginUserDTO} userDTO - The login data transfer object containing the user's email and password.
   * @returns {Promise<SignInResponseDto>} A promise that resolves to a `SignInResponseDto` containing the authentication token.
   *
   * @throws {UnauthorizedException} If the user does not exist or the provided password is incorrect.
   *
   * @description This method verifies if the user exists, checks the password, and generates a JWT token if the credentials are valid.
   */
  async signInUser(userDTO: LoginUserDTO): Promise<SignInResponseDto> {
    const isUserExists: boolean = await this.#isUserExists(userDTO.email);
    if (!isUserExists) {
      this.logger.error(`${userDTO.email} doesn't exists`);
      throw new UnauthorizedException();
    }

    const user: UserAccount = await this.userAccountRepository.findOneBy({
      email: userDTO.email,
    });

    if (!bcrypt.compareSync(userDTO.password, user.passwordHash)) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    };

    return new SignInResponseDto(await this.jwtService.signAsync(payload));
  }

  /**
   * Retrieves a user account by its ID.
   *
   * @param {number} userId - The unique ID of the user account to retrieve.
   * @returns {Promise<UserAccount>} A promise that resolves to the retrieved `UserAccount` entity.
   *
   * @throws {NotFoundException} If the user account with the given ID does not exist.
   */
  async getById(userId: number): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.findOneBy({
      id: userId,
    });

    if (!userAccount) {
      throw new NotFoundException('User does not exist');
    }

    return userAccount;
  }

  /**
   * Retrieves a user account by its email address.
   *
   * @param {string} email - The email address of the user account to retrieve.
   * @returns {Promise<UserAccount>} A promise that resolves to the retrieved `UserAccount` entity.
   *
   * @throws {NotFoundException} If the user account with the given email does not exist.
   */
  async getByEmail(email: string): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.findOneBy({ email :email })
    console.log(JSON.stringify(userAccount))
    if (!userAccount) {
      throw new NotFoundException('User does not exist');
    }

    return userAccount;
  }
}
