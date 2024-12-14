import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDTO } from '../dto/createProjectDTO';
import { UserAccountsService } from '../../userAccounts/services/userAccounts.service';
import { Status } from '../../statuses/entities/status.entity';
import { Category } from '../../categories/entities/category.entity';
import { CategoriesService } from '../../categories/services/categories.service';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    private readonly userAccountService: UserAccountsService,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(
    createProjectDTO: CreateProjectDTO,
    userId: number,
  ): Promise<number> {
    const user = await this.userAccountService.getById(userId);
    let status: Status;
    status = await this.statusRepository.findOneBy({ name: 'New' });

    if (!status) {
      const newStatus = new Status('New');
      status = await this.statusRepository.save(newStatus);
    }

    const categories: Category[] = [];

    if (createProjectDTO.categories) {
      for (const categoryId of createProjectDTO.categories) {
        const category = await this.categoryService.findOne(categoryId);
        categories.push(category);
      }
    }

    const project = new Project(
      createProjectDTO.name,
      createProjectDTO.description,
      user,
      status,
      categories,
    );

    const savedProject: Project = await this.projectRepository.save(project);

    return savedProject.id;
  }
}
