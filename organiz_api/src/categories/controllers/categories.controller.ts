import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Post, Put, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateCategoryDTO } from '../dto/createCategoryDTO';
import { CategoriesService } from '../services/categories.service';
import { Request } from 'express';
import { UpdateCategoryDTO } from '../dto/updateCategoryDTO';
import { Category } from '../entities/category.entity';

@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Creates a new category.
   *
   * @param {CreateCategoryDTO} createCategoryDTO - The DTO containing the name of the category to be created.
   * @param {Request} request - The incoming HTTP request object.
   * @returns {Promise<number>} A promise that resolves to an object containing the ID of the created category.
   *
   * @description Logs the request details, creates a new category using the service, and returns its ID.
   */
  @Post()
  @ApiCreatedResponse({ description: 'Category creation' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
    @Req() request: Request,
  ): Promise<number> {
    this.logger.log(`${request.method} ${request.url}`);

    const categoryId: number = await this.categoriesService.create(
      createCategoryDTO.name,
    );
    this.logger.log(`Category ${createCategoryDTO.name} created`);
    return categoryId;
  }

  /**
   * Retrieves all categories.
   *
   * @param {Request} request - The incoming HTTP request object.
   * @returns {Promise<Category[]>} A promise that resolves to a list of all categories.
   *
   * @description Logs the request details and fetches all categories from the service.
   *
   */
  @Get()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get all categories' })
  @HttpCode(HttpStatus.OK)
  async getAllCategories(@Req() request: Request): Promise<Category[]> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.categoriesService.findAll();
  }

  /**
   * Retrieves a category by ID.
   *
   * @param {Request} request - The incoming HTTP request object.
   * @param {number} id - The ID of the category to retrieve.
   * @returns {Promise<Category>} A promise that resolves to the category details.
   *
   * @description Logs the request details and fetches a category by its ID using the service.
   *
   * @decorator `@Get(':id')` - Defines the route as a GET request with an ID parameter.
   * @decorator `@ApiBearerAuth()` - Requires bearer authentication.
   * @decorator `@ApiCreatedResponse({ description: 'Get all categories by id' })` - Documents the API response using Swagger.
   * @decorator `@HttpCode(HttpStatus.OK)` - Sets the HTTP status code to 200.
   */
  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get all categories by id' })
  @HttpCode(HttpStatus.OK)
  async getCategories(@Req() request: Request, @Param('id') id: number): Promise<Category> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.categoriesService.findOne(id);
  }

  /**
   * Updates a category by ID.
   *
   * @param {UpdateCategoryDTO} updateCategoryDTO - The DTO containing the updated name of the category.
   * @param {Request} request - The incoming HTTP request object.
   * @param {number} id - The ID of the category to update.
   * @returns {Promise<Category>} A promise that resolves to the updated category details.
   *
   * @description Logs the request details and updates a category by its ID using the service.
   *
   */
  @Put(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Update categories by id' })
  @HttpCode(HttpStatus.OK)
  async modifyCategory(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Req() request: Request,
    @Param('id') id: number,
  ) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.categoriesService.update(id, updateCategoryDTO.name);
  }

  /**
   * Deletes a category by ID.
   *
   * @param {Request} request - The incoming HTTP request object.
   * @param {number} id - The ID of the category to delete.
   * @returns {Promise<number>} A promise that resolves to the result of the deletion.
   *
   * @description Logs the request details and deletes a category by its ID using the service.
   *
   */
  @Delete(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Delete categories by id' })
  @HttpCode(HttpStatus.OK)
  async deleteCategories(@Req() request: Request, @Param('id') id: number): Promise<number> {
    this.logger.log(`${request.method} ${request.url}`);
    return this.categoriesService.delete(id);
  }
}
