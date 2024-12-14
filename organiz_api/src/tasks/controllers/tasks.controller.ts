import { Request, Body, Controller, Logger, Post } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
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
}
