import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateCategoryDTO } from '../dto/createCategoryDTO';
import { CategoriesService } from '../services/categories.service';
import { Request } from 'express';
import { retry } from "rxjs";

@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Category creation' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
    @Req() request: Request,
  ): Promise<object> {
    this.logger.log(`${request.method} ${request.url}`);

    const categoryId: number = await this.categoriesService.create(
      createCategoryDTO.name,
    );
    this.logger.log(`Category ${createCategoryDTO.name} created`);
    return { id: categoryId };
  }

  @Get()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get all categories' })
  @HttpCode(HttpStatus.OK)
  async getAllCategories(@Req() request: Request) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Get all categories by id' })
  @HttpCode(HttpStatus.OK)
  async getCategories(@Req() request: Request, @Param('id') id: number) {
    this.logger.log(`${request.method} ${request.url}`);
    return this.categoriesService.findOne(id);
  }
}
