import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { UserAccountsService } from '../services/user_accounts.service';
import { RegisterUserDTO } from '../dto/registerUserDTO';
import { ApiCreatedResponse } from '@nestjs/swagger';

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

    const id: number = await this.userAccountsService.create_user(data);
    return { id: id };
  }
}
