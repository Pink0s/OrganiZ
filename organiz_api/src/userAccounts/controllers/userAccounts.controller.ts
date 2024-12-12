import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { UserAccountsService } from '../services/userAccounts.service';
import { RegisterUserDTO } from '../dto/registerUserDTO';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { LoginUserDTO } from '../dto/loginUserDTO';

/**
 * Controller responsible for managing user accounts.
 * Handles HTTP requests related to user registration.
 */
@Controller('users')
export class UserAccountsController {
  private readonly logger: Logger = new Logger(UserAccountsController.name);

  constructor(private readonly userAccountsService: UserAccountsService) {}

  /**
   * Endpoint for registering a new user.
   * @param request - The incoming HTTP request object.
   * @param data - The DTO containing user registration details.
   * @returns An object containing the ID of the newly created user.
   * @throws ConflictException - If a user with the given email already exists.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User registration' })
  async registerUser(@Req() request: Request, @Body() data: RegisterUserDTO) {
    this.logger.log(`${request.method} ${request.url}`);
    this.logger.debug(`${request.method} ${request.url} ${data}`);

    const id: number = await this.userAccountsService.createUser(data);
    return { id: id };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'User login' })
  async loginUser(
    @Req() request: Request,
    @Body() data: LoginUserDTO,
  ): Promise<null> {
    this.logger.log(`${request.method} ${request.url}`);
    this.logger.debug(`${request.method} ${request.url} ${data}`);
    return;
  }
}
