import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../entities/status.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../../categories/services/categories.service';

/**
 * Service for managing statuses.
 *
 * @injectable
 * Handles all business logic related to the `Status` entity.
 */
@Injectable()
export class StatusesService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  /**
   * Creates a new status.
   *
   * @param {string} name - The name of the status to create.
   * @returns {Promise<number>} A promise that resolves to the ID of the created status.
   *
   * @throws {ConflictException} If a status with the same name already exists.
   */
  async createStatus(name: string): Promise<number> {
    const isStatusExists = await this.statusRepository.exists({
      where: { name: name },
    });

    if (isStatusExists) {
      throw new ConflictException(`Status ${name} already exists`);
    }

    const status = new Status(name);
    const savedStatus = await this.statusRepository.save(status);

    return savedStatus.id;
  }

  /**
   * Retrieves all statuses that have not been marked as deleted.
   *
   * @returns {Promise<Status[]>} A promise that resolves to an array of `Status` entities.
   */
  async findAll(): Promise<Status[]> {
    return this.statusRepository.findBy({ deletedAt: null });
  }

  /**
   * Retrieves a single status by ID.
   *
   * @param {number} id - The ID of the status to retrieve.
   * @returns {Promise<Status>} A promise that resolves to the `Status` entity.
   *
   * @throws {NotFoundException} If the status does not exist or has been marked as deleted.
   */
  async findOne(id: number): Promise<Status> {
    const status: Status = await this.statusRepository.findOneBy({ id: id });

    if (!status || status.deletedAt !== null) {
      throw new NotFoundException(`Status ${id} not found`);
    }

    return status;
  }

  /**
   * Updates an existing status by ID.
   *
   * @param {number} id - The ID of the status to update.
   * @param {string} name - The new name for the status.
   * @returns {Promise<Status>} A promise that resolves to the updated `Status` entity.
   *
   * @throws {ConflictException} If a status with the new name already exists.
   * @throws {NotFoundException} If the status to update does not exist.
   */
  async update(id: number, name: string): Promise<Status> {
    const actualStatus: Status = await this.findOne(id);

    const isStatusExists: boolean = await this.statusRepository.exists({
      where: { name: name },
    });

    if (isStatusExists) {
      throw new ConflictException(`Status ${name} already exists`);
    }

    actualStatus.name = name;
    actualStatus.updatedAt = new Date();

    return await this.statusRepository.save(actualStatus);
  }

  /**
   * Marks a status as deleted by ID.
   *
   * @param {number} id - The ID of the status to delete.
   * @returns {Promise<number>} A promise that resolves to the ID of the deleted status.
   *
   * @throws {NotFoundException} If the status to delete does not exist.
   */
  async delete(id: number): Promise<number> {
    const status: Status = await this.findOne(id);
    status.deletedAt = new Date();
    const savedStatus: Status = await this.statusRepository.save(status);
    return savedStatus.id;
  }
}
