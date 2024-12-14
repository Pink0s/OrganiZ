import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateTaskDTO } from '../dto/createTaskDTO';
import { ProjectsService } from '../../projects/services/projects.service';
import { Project } from '../../projects/entities/project.entity';
import { Status } from '../../statuses/entities/status.entity';
import { UserAccount } from '../../userAccounts/entities/userAccount.entity';

@Injectable()
export class TasksService {
  private readonly logger: Logger = new Logger(TasksService.name);
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(userId: number, createTaskDTO: CreateTaskDTO): Promise<number> {
    const user: UserAccount = await this.userAccountRepository.findOneBy({
      id: userId,
    });

    const project: Project = await this.projectsService.findOneById(
      userId,
      createTaskDTO.projectId,
    );

    const status: Status = await this.statusRepository.findOneBy({
      name: 'New',
    });

    const task: Task = new Task(
      createTaskDTO.name,
      createTaskDTO.description,
      status,
      project,
      user,
    );

    const savedTask = await this.taskRepository.save(task);

    return savedTask.id;
  }

  async findById(id: number): Promise<Task> {
    const task: Task = await this.taskRepository.findOneBy({ id: id });

    if (!task || task.deletedAt !== null) {
      this.logger.error(`Task with id ${id} not found`);
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async findAll(
    userId: number,
    projectId?: number,
    onlyMy?: boolean,
  ): Promise<Task[]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoin('task.project', 'project')
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

    if (projectId) {
      query.andWhere('project.id = :projectId', { projectId });
    }

    if (onlyMy) {
      query.andWhere('task.assigned_user_id = :userId', { userId });
    }

    return await query.getMany();
  }

  async delete(userId: number, taskId: number): Promise<number> {
    const user: UserAccount = await this.userAccountRepository.findOneBy({
      id: userId,
    });

    const isTaskExists = await this.taskRepository.existsBy({ id: taskId });

    if (!isTaskExists) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    const task: Task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['project'],
    });

    let AmIUser: boolean = false;
    for (const usr of task.project.userAccounts) {
      if (usr.id === userId) {
        AmIUser = true;
      }
    }

    if (user.id !== task.project.owner.id && !AmIUser) {
      throw new UnauthorizedException('Unauthorized');
    }

    task.deletedAt = new Date();

    const deletedTask: Task = await this.taskRepository.save(task);

    return deletedTask.id;
  }
}
