import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateCategoryDTO } from '../dto/createCategoryDTO';
import { CategoriesService } from '../services/categories.service';
import { Request } from 'express';

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
}
