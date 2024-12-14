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
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiQuery } from '@nestjs/swagger';
import { CreateProjectDTO } from '../dto/createProjectDTO';
import { CategoriesService } from '../../categories/services/categories.service';
import { ProjectsService } from '../services/projects.service';
import { UpdateProjectDTO } from '../dto/updateProjectDTO';
import { Project } from '../entities/project.entity';

/**
 * Controller for managing projects.
 *
 * @controller
 * Handles operations such as creating, updating, retrieving, and deleting projects.
 */
@Controller('projects')
export class ProjectsController {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Creates a new project.
   *
   * @param {CreateProjectDTO} createProjectDTO - The DTO containing project details.
   * @param {any} request - The incoming HTTP request, containing user information.
   * @returns {Promise<number>} A promise that resolves to the id of created project.
   *
   */
  @Post()
  @ApiCreatedResponse({ description: 'Project creation' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  async createProject(
    @Body() createProjectDTO: CreateProjectDTO,
    @Request() request: any,
  ): Promise<number> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.projectsService.create(createProjectDTO, request.user.id);
  }

  /**
   * Retrieves all projects, optionally filtered by status name.
   *
   * @param {any} request - The incoming HTTP request, containing user information.
   * @param {string} [statusName] - The optional status name to filter projects.
   * @returns {Promise<Project[]>} A promise that resolves to an array of projects.
   *
   */
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
  ): Promise<Project[]> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.projectsService.findAll(request.user.id, statusName);
  }

  /**
   * Retrieves a single project by ID.
   *
   * @param {any} request - The incoming HTTP request, containing user information.
   * @param {number} id - The ID of the project to retrieve.
   * @returns {Promise<Project>} A promise that resolves to the project.
   */
  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get one project by id' })
  async getOneProjectById(
    @Request() request: any,
    @Param('id') id: number,
  ): Promise<Project> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.projectsService.findOneById(request.user.id, id);
  }

  /**
   * Adds a user to a project by their email address.
   *
   * @param {any} request - The incoming HTTP request object, containing user authentication and metadata.
   * @param {number} id - The ID of the project to which the user will be added.
   * @param {string} email - The email address of the user to be added to the project.
   * @returns {Promise<number>} A promise that resolves to the ID of the project after the user is added.
   *
   */
  @Patch(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Modify one project by id' })
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'email',
    required: true,
    type: String,
    description: 'Email address',
  })
  async addUserToProject(
    @Request() request: any,
    @Param('id') id: number,
    @Query('email') email: string,
  ): Promise<number> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.projectsService.addUserToProject(id, email);
  }
  /**
   * Updates a project by ID.
   *
   * @param {any} request - The incoming HTTP request, containing user information.
   * @param {number} id - The ID of the project to update.
   * @param {UpdateProjectDTO} updateProjectDTO - The DTO containing updated project details.
   * @returns {Promise<Project>} A promise that resolves to the updated project.
   *
   */
  @Put(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Modify one project by id' })
  @HttpCode(HttpStatus.OK)
  async updateProject(
    @Request() request: any,
    @Param('id') id: number,
    @Body() updateProjectDTO: UpdateProjectDTO,
  ): Promise<Project> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.projectsService.updateById(
      request.user.id,
      id,
      updateProjectDTO,
    );
  }

  /**
   * Deletes a project by ID.
   *
   * @param {any} request - The incoming HTTP request, containing user information.
   * @param {number} id - The ID of the project to delete.
   * @returns {Promise<number>} A promise that resolves the id of the deletion.
   */
  @Delete(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Delete project by id' })
  @HttpCode(HttpStatus.OK)
  async deleteOneProject(
    @Request() request: any,
    @Param('id') id: number,
  ): Promise<number> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.projectsService.deleteById(request.user.id, id);
  }
}
