import {
  Request,
  Body,
  Controller,
  Logger,
  Post,
  Get,
  Param,
  Query, Delete
} from "@nestjs/common";
import { TasksService } from '../services/tasks.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiQuery } from "@nestjs/swagger";
import { CreateTaskDTO } from '../dto/createTaskDTO';

@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Create a task' })
  async createTask(
    @Request() request: any,
    @Body() createTaskDTO: CreateTaskDTO,
  ) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.tasksService.create(request.user.id, createTaskDTO);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get a task by id' })
  async getTask(@Param('id') id: number, @Request() request: any) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.tasksService.findById(id);
  }

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
  ) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.tasksService.findAll(request.user.id, projectId, onlyMy);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Delete a task' })
  async deleteTask(@Param('id') id: number, @Request() request: any) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.tasksService.delete(request.user.id, id);
  }
}
