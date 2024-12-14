import {
  Request,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateProjectDTO } from '../dto/createProjectDTO';
import { CategoriesService } from '../../categories/services/categories.service';
import { ProjectsService } from '../services/projects.service';

@Controller('projects')
export class ProjectsController {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Project creation' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  async createProject(
    @Body() createProjectDTO: CreateProjectDTO,
    @Request() request: any,
  ) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.projectsService.create(createProjectDTO, request.user.id);
  }
}
