import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../entities/status.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../../categories/services/categories.service';

@Injectable()
export class StatusesService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async createStatus(name: string): Promise<number> {
    const isStatusExists = await this.statusRepository.exists({ where: { name: name } });

    if (isStatusExists) {
      throw new ConflictException(`Status ${name} already exists`);
    }

    const status = new Status(name);
    const savedStatus = await this.statusRepository.save(status);

    return savedStatus.id;
  }
}
