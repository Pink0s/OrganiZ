import { Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateTaskDTO } from '../dto/createTaskDTO';
import { ProjectsService } from '../../projects/services/projects.service';
import { Project } from '../../projects/entities/project.entity';
import { Status } from '../../statuses/entities/status.entity';
import { UserAccount } from '../../userAccounts/entities/userAccount.entity';
import { UpdateTaskDTO } from '../dto/updateTaskDTO';

/**
 * Service for managing tasks.
 *
 * @injectable
 * Handles operations such as creating, retrieving, updating, and deleting tasks.
 */
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

  /**
   * Creates a new task.
   *
   * @param {number} userId - The ID of the user creating the task.
   * @param {CreateTaskDTO} createTaskDTO - The DTO containing task details.
   * @returns {Promise<number>} A promise that resolves to the ID of the created task.
   *
   * @throws {NotFoundException} If the project or status is not found.
   */
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

  /**
   * Retrieves a task by its ID.
   *
   * @param {number} id - The ID of the task to retrieve.
   * @returns {Promise<Task>} A promise that resolves to the retrieved task.
   *
   * @throws {NotFoundException} If the task is not found or marked as deleted.
   */
  async findById(id: number): Promise<Task> {
    const task: Task = await this.taskRepository.findOneBy({ id: id });

    if (!task || task.deletedAt !== null) {
      this.logger.error(`Task with id ${id} not found`);
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return await this.taskRepository.findOne({
      where: { id: id },
      relations: ['status'],
    });
  }

  /**
   * Retrieves all tasks for a user, optionally filtered by project ID or ownership.
   *
   * @param {number} userId - The ID of the user retrieving tasks.
   * @param {number} [projectId] - Optional project ID to filter tasks.
   * @param {boolean} [onlyMy] - Optional flag to filter tasks assigned to the user.
   * @returns {Promise<Task[]>} A promise that resolves to an array of tasks.
   */
  async findAll(
    userId: number,
    projectId?: number,
    onlyMy?: boolean,
  ): Promise<Task[]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoin('task.project', 'project')
      .leftJoin('project.userAccounts', 'userAccount')
      .leftJoinAndSelect('project.categories', 'categories')
      .leftJoinAndSelect('task.status', 'status')
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

  /**
   * Updates a task by its ID.
   *
   * @param {number} userId - The ID of the user performing the update.
   * @param {number} taskId - The ID of the task to update.
   * @param {UpdateTaskDTO} updateTaskDTO - The DTO containing updated task details.
   * @returns {Promise<Task>} A promise that resolves to the updated task.
   *
   * @throws {NotFoundException} If the task or status is not found.
   * @throws {UnauthorizedException} If the user is not authorized to update the task.
   */
  async updateTask(
    userId: number,
    taskId: number,
    updateTaskDTO: UpdateTaskDTO,
  ): Promise<Task> {
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

    if (!task || task.deletedAt !== null) {
      this.logger.error(`Task with id ${task.id} not found`);
      throw new NotFoundException(`Task with id ${task.id} not found`);
    }

    let AmIUser: boolean = false;
    for (const usr of task.project.userAccounts) {
      if (usr.id === userId) {
        AmIUser = true;
      }
    }

    if (task.project.owner.id !== user.id && !AmIUser) {
      this.logger.error(`This user cannot modify this task`);
      throw new UnauthorizedException(`This user cannot modify this task`);
    }

    if (updateTaskDTO.name && updateTaskDTO.name !== task.name) {
      task.name = updateTaskDTO.name;
    }

    if (
      updateTaskDTO.description &&
      updateTaskDTO.description !== task.description
    ) {
      task.description = updateTaskDTO.description;
    }

    if (updateTaskDTO.statusId) {
      const status = await this.statusRepository.findOneBy({
        id: updateTaskDTO.statusId,
      });

      if (!status) {
        this.logger.error(`Status with id ${status.id} not found`);
        throw new NotFoundException(`Status with id ${status.id} not found`);
      }

      task.status = status;
    }

    task.updatedAt = new Date();

    return this.taskRepository.save(task);
  }

  /**
   * Deletes a task by its ID.
   *
   * @param {number} userId - The ID of the user performing the deletion.
   * @param {number} taskId - The ID of the task to delete.
   * @returns {Promise<number>} A promise that resolves to the ID of the deleted task.
   *
   * @throws {NotFoundException} If the task is not found.
   * @throws {UnauthorizedException} If the user is not authorized to delete the task.
   */
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
