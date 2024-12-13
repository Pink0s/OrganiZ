import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { UserAccount } from '../../userAccounts/entities/userAccount.entity';
import { Category } from '../../categories/entities/category.entity';
import { Status } from '../../statuses/entities/status.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 55, unique: true, nullable: false })
  name: string;

  @Column({ type: 'text', unique: false, nullable: true })
  description: string;

  @ManyToMany(
    () => UserAccount,
    (userAccount: UserAccount) => userAccount.projects,
    { onUpdate: 'CASCADE', eager: true },
  )
  userAccounts: UserAccount[];

  @ManyToOne(
    () => UserAccount,
    (userAccount: UserAccount) => userAccount.ownedProjects,
    {
      onUpdate: 'CASCADE',
      eager: true,
    },
  )
  @JoinColumn({ name: 'owner_id' })
  owner: UserAccount;

  @ManyToMany(() => Category, (category: Category) => category.projects, {})
  @JoinTable({
    name: 'projects_categories',
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];

  @ManyToOne(() => Status, (status: Status) => status.id, { eager: true })
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @OneToMany(() => Task, (task: Task) => task.id, {})
  tasks: Task[];

  @OneToMany(() => UserAccount, (user: UserAccount) => user.id, {})
  userAccount: UserAccount;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
