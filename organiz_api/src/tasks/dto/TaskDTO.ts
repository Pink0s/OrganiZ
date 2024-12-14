import { Status } from '../../statuses/entities/status.entity';
import { Task } from '../entities/task.entity';

export class TaskDTO {
  name: string;
  description: string | undefined;
  owner: string;
  status: Status;
  created_at: Date;
  updated_at: Date;

  constructor(task: Task) {
    this.name = task.name;
    this.description = task.description;
    this.owner = task.assignedUser.email;
    this.status = task.status;
    this.created_at = task.createdAt;
    this.updated_at = task.updatedAt;
  }
}