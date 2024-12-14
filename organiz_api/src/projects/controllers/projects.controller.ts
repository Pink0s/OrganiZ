import {
  Request,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiQuery } from '@nestjs/swagger';
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

  @Get()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get all projects' })
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'statusName',
    required: false,
    type: String,
    description: 'Filter by status name',
  })
  async getAllProjects(
    @Request() request: any,
    @Query('statusName') statusName?: string,
  ) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.projectsService.findAll(request.user.id, statusName);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get one project by id' })
  async getOneProjectById(@Request() request: any, @Param('id') id: number) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.projectsService.findOneById(request.user.id, id);
  }
}
