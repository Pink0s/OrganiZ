import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { Brackets, Repository } from 'typeorm';
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
      const acceptedStatus = new Status('Accepted');
      const onGoingStatus = new Status('OnGoing');
      const completedStatus = new Status('Completed');
      status = await this.statusRepository.save(newStatus);
      await this.statusRepository.save(acceptedStatus);
      await this.statusRepository.save(onGoingStatus);
      await this.statusRepository.save(completedStatus);
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

  async findAll(userId: number, statusName?: string): Promise<Project[]> {
    const query = this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.userAccounts', 'userAccount')
      .leftJoinAndSelect('project.status', 'status')
      .andWhere(
        new Brackets((qb) => {
          qb.where('project.owner = :userId', { userId }).orWhere(
            'userAccount.id = :userId',
            { userId },
          );
        }),
      )
      .andWhere('project.deleted_at IS NULL');

    if (statusName) {
      query.andWhere('status.name = :statusName', { statusName })
    }

    return await query.getMany();
  }

  async findOneById(userId: number, projectId: number): Promise<Project> {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.userAccounts', 'userAccount')
      .leftJoinAndSelect('project.status', 'status')
      .where('project.id = :projectId', { projectId })
      .andWhere('project.deleted_at IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where('project.owner = :userId', { userId }).orWhere(
            'userAccount.id = :userId',
            { userId },
          );
        }),
      )
      .getOne();

    if (!project) {
      this.logger.error(`Project id : ${projectId} not found`);
      throw new NotFoundException('Project not found');
    }

    return project;
  }
}
