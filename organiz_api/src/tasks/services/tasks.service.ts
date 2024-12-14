import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
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

  async getById(userId: number, id: number): Promise<Task> {
    const task: Task = await this.taskRepository.findOneBy({ id: id });

    if (!task || task.deletedAt !== null) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }
}
