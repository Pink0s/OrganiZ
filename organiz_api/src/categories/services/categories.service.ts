import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(name: string): Promise<number> {
    const isCategoryExists = await this.categoryRepository.existsBy({
      name: name,
    });

    if (isCategoryExists) {
      this.logger.error(`Category already exists`);
      throw new ConflictException('Category already exists');
    }

    const category = new Category(name);

    const savedCategory: Category =
      await this.categoryRepository.save(category);

    return savedCategory.id;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category: Category = await this.categoryRepository.findOneBy({
      id: id,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
