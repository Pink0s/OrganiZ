import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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

  /**
   * Creates a new category.
   *
   * @param {string} name - The name of the category to create.
   * @returns {Promise<number>} A promise that resolves to the ID of the created category.
   *
   * @throws {ConflictException} If a category with the same name already exists.
   */
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

  /**
   * Retrieves all categories that have not been marked as deleted.
   *
   * @returns {Promise<Category[]>} A promise that resolves to an array of Category entities.
   */
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findBy({ deletedAt: null });
  }

  /**
   * Retrieves a category by its ID.
   *
   * @param {number} id - The ID of the category to retrieve.
   * @returns {Promise<Category>} A promise that resolves to the found Category entity.
   *
   * @throws {NotFoundException} If the category does not exist or has been deleted.
   */
  async findOne(id: number): Promise<Category> {
    const category: Category = await this.categoryRepository.findOneBy({
      id: id,
    });

    if (!category || category.deletedAt !== null) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  /**
   * Updates the name of a category.
   *
   * @param {number} id - The ID of the category to update.
   * @param {string} name - The new name for the category.
   * @returns {Promise<Category>} A promise that resolves to the updated Category entity.
   */
  async update(id: number, name: string): Promise<Category> {
    const category: Category = await this.findOne(id);
    category.name = name;
    category.updatedAt = new Date();
    return await this.categoryRepository.save(category);
  }

  /**
   * Marks a category as deleted.
   *
   * @param {number} id - The ID of the category to delete.
   * @returns {Promise<number>} A promise that resolves to the ID of the deleted category.
   */
  async delete(id: number): Promise<number> {
    const category: Category = await this.findOne(id);
    category.deletedAt = new Date();
    const savedCategory = await this.categoryRepository.save(category);
    return savedCategory.id;
  }
}
