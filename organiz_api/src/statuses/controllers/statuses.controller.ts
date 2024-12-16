import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { StatusesService } from '../services/statuses.service';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateStatusDTO } from '../dto/createStatusDTO';
import { UpdateStatusDTO } from '../dto/updateStatusDTO';
import { Status } from '../entities/status.entity';

/**
 * Controller for managing statuses.
 *
 * @controller
 * Handles CRUD operations for status resources.
 */
@Controller('statuses')
export class StatusesController {
  private readonly logger = new Logger(StatusesController.name);
  constructor(private readonly statusesService: StatusesService) {}

  /**
   * Creates a new status.
   *
   * @param {Request} request - The incoming HTTP request.
   * @param {CreateStatusDTO} createStatusDTO - The DTO containing the name of the new status.
   * @returns {Promise<number>} A promise that resolves to the created status object.
   *
   */
  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Create a status' })
  @HttpCode(HttpStatus.CREATED)
  async createStatus(
    @Req() request: Request,
    @Body() createStatusDTO: CreateStatusDTO,
  ): Promise<number> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.statusesService.createStatus(createStatusDTO.name);
  }

  /**
   * Retrieves all statuses.
   *
   * @param {Request} request - The incoming HTTP request.
   * @returns {Promise<Status[]>} A promise that resolves to an array of status objects.
   *
   */
  @Get()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get all status' })
  @HttpCode(HttpStatus.OK)
  async getAllStatus(@Req() request: Request): Promise<Status[]> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.statusesService.findAll();
  }

  /**
   * Retrieves a single status by ID.
   *
   * @param {Request} request - The incoming HTTP request.
   * @param {number} id - The ID of the status to retrieve.
   * @returns {Promise<Status>} A promise that resolves to the status object.
   *
   */
  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get one status' })
  @HttpCode(HttpStatus.OK)
  async getOneStatus(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<Status> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.statusesService.findOne(id);
  }

  /**
   * Updates an existing status by ID.
   *
   * @param {Request} request - The incoming HTTP request.
   * @param {number} id - The ID of the status to update.
   * @param {UpdateStatusDTO} updateStatusDTO - The DTO containing the updated name of the status.
   * @returns {Promise<Status>} A promise that resolves to the updated status object.
   *
   */
  @Put(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Update a status' })
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateStatusDTO: UpdateStatusDTO,
  ): Promise<Status> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.statusesService.update(id, updateStatusDTO.name);
  }

  /**
   * Deletes a status by ID.
   *
   * @param {Request} request - The incoming HTTP request.
   * @param {number} id - The ID of the status to delete.
   * @returns {Promise<number>} A promise that resolves to the result of the deletion.
   *
   */
  @Delete(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Delete a status' })
  @HttpCode(HttpStatus.OK)
  async deleteStatus(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<number> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.statusesService.delete(id);
  }
}
