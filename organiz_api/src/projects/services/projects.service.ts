import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateProjectDTO } from '../dto/createProjectDTO';
import { UserAccountsService } from '../../userAccounts/services/userAccounts.service';
import { Status } from '../../statuses/entities/status.entity';
import { Category } from '../../categories/entities/category.entity';
import { CategoriesService } from '../../categories/services/categories.service';
import { UpdateProjectDTO } from '../dto/updateProjectDTO';
import { StatusesService } from '../../statuses/services/statuses.service';

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
    private readonly statusService: StatusesService,
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
      .leftJoinAndSelect('project.categories', 'categories')
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
      query.andWhere('status.name = :statusName', { statusName });
    }

    return await query.getMany();
  }

  async findOneById(userId: number, projectId: number): Promise<Project> {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.userAccounts', 'userAccount')
      .leftJoinAndSelect('project.status', 'status')
      .leftJoinAndSelect('project.categories', 'categories')
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

  async updateById(
    userId: number,
    projectId: number,
    updateProjectDTO: UpdateProjectDTO,
  ): Promise<Project> {
    const project: Project = await this.findOneById(userId, projectId);

    if (!project) {
      this.logger.error(`Project id : ${projectId} not found`);
      throw new NotFoundException('Project not found');
    }

    if (updateProjectDTO.name && updateProjectDTO.name !== project.name) {
      project.name = updateProjectDTO.name;
    }

    if (
      updateProjectDTO.description &&
      updateProjectDTO.description !== project.description
    ) {
      project.description = updateProjectDTO.description;
    }

    if (
      updateProjectDTO.status &&
      updateProjectDTO.status !== project.status.id
    ) {
      project.status = await this.statusService.findOne(
        updateProjectDTO.status,
      );
    }

    if (updateProjectDTO.categories) {
      if (updateProjectDTO.categories.length > 0) {
        const categories: Category[] = [];
        for (const categoryIds of updateProjectDTO.categories) {
          categories.push(await this.categoryService.findOne(categoryIds));
        }
        project.categories = categories;
      } else {
        project.categories = [];
      }
    }

    return this.projectRepository.save(project);
  }

  async deleteById(userId: number, projectId: number): Promise<number> {
    const project = await this.projectRepository.findOne({
      where: [{ id: projectId, deletedAt: null }],
      relations: ['owner'],
    });

    if (!project) {
      this.logger.error(`Project id : ${projectId} not found`);
      throw new NotFoundException('Project not found');
    }

    if (project.owner.id !== userId) {
      throw new UnauthorizedException('You are not authorized');
    }

    project.deletedAt = new Date();

    const savedProject = await this.projectRepository.save(project);

    return savedProject.id;
  }
}
