import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../../statuses/entities/status.entity';
import { Project } from '../../projects/entities/project.entity';
import { UserAccount } from '../../userAccounts/entities/userAccount.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 35, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Status, (status: Status) => status.id, {})
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @ManyToOne(() => Project, (project: Project) => project.id, {})
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(
    () => UserAccount,
    (userAccount: UserAccount) => userAccount.id,
    {},
  )
  @JoinColumn({ name: 'assigned_user_id' })
  assignedUser: UserAccount;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  constructor(
    name: string,
    description: string | undefined,
    status: Status,
    project: Project,
    user: UserAccount,
  ) {
    this.name = name;
    this.description = description;
    this.status = status;
    this.project = project;
    this.assignedUser = user;
  }
}
