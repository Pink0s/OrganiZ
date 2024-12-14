import {
  Request,
  Body,
  Controller,
  Logger,
  Post,
  Get,
  Param,
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiQuery } from '@nestjs/swagger';
import { CreateTaskDTO } from '../dto/createTaskDTO';
import { UpdateTaskDTO } from '../dto/updateTaskDTO';
import { Task } from '../entities/task.entity';

/**
 * Controller for managing tasks.
 *
 * @controller
 * Handles operations such as creating, retrieving, updating, and deleting tasks.
 */
@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  /**
   * Creates a new task.
   *
   * @param {any} request - The incoming HTTP request object containing user metadata.
   * @param {CreateTaskDTO} createTaskDTO - The data transfer object for creating a task.
   * @returns {Promise<number>} A promise that resolves to the ID of the created task.
   *
   */
  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Create a task' })
  async createTask(
    @Request() request: any,
    @Body() createTaskDTO: CreateTaskDTO,
  ): Promise<number> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.tasksService.create(request.user.id, createTaskDTO);
  }

  /**
   * Retrieves a task by its ID.
   *
   * @param {number} id - The ID of the task to retrieve.
   * @param {any} request - The incoming HTTP request object.
   * @returns {Promise<Task>} A promise that resolves to the retrieved task.
   *
   */
  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get a task by id' })
  async getTask(
    @Param('id') id: number,
    @Request() request: any,
  ): Promise<Task> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.tasksService.findById(id);
  }

  /**
   * Retrieves all tasks, optionally filtered by project ID or ownership.
   *
   * @param {any} request - The incoming HTTP request object containing user metadata.
   * @param {number} [projectId] - Optional project ID to filter tasks.
   * @param {boolean} [onlyMy] - Optional flag to filter only tasks assigned to the current user.
   * @returns {Promise<Task[]>} A promise that resolves to an array of tasks.
   *
   */
  @Get()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get all tasks' })
  @ApiQuery({
    name: 'onlyMy',
    required: false,
    type: String,
    description: 'Filter only my tasks',
  })
  @ApiQuery({
    name: 'projectId',
    required: false,
    type: String,
    description: 'Filter tasks by projectId',
  })
  async getAllTasks(
    @Request() request: any,
    @Query('projectId') projectId?: number,
    @Query('onlyMy') onlyMy?: boolean,
  ): Promise<Task[]> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.tasksService.findAll(request.user.id, projectId, onlyMy);
  }

  /**
   * Updates a task by its ID.
   *
   * @param {number} id - The ID of the task to update.
   * @param {any} request - The incoming HTTP request object containing user metadata.
   * @param {UpdateTaskDTO} updateTaskDTO - The data transfer object for updating a task.
   * @returns {Promise<Task>} A promise that resolves to the updated task.
   */
  @Put(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Update a task' })
  async updateTask(
    @Param('id') id: number,
    @Request() request: any,
    @Body() updateTaskDTO: UpdateTaskDTO,
  ): Promise<Task> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.tasksService.updateTask(request.user.id, id, updateTaskDTO);
  }

  /**
   * Deletes a task by its ID.
   *
   * @param {number} id - The ID of the task to delete.
   * @param {any} request - The incoming HTTP request object containing user metadata.
   * @returns {Promise<number>} A promise that resolves to the ID of the deletion.
   *
   */
  @Delete(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Delete a task' })
  async deleteTask(
    @Param('id') id: number,
    @Request() request: any,
  ): Promise<number> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.tasksService.delete(request.user.id, id);
  }
}
