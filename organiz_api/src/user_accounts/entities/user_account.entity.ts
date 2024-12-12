import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';

/**
 * Represents a user account in the system.
 * This entity is mapped to the `user_accounts` table in the database.
 */
@Entity('user_accounts')
export class UserAccount {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 25, nullable: false })
  firstname: string;

  @Column({ type: 'varchar', length: 25, nullable: false })
  lastname: string;

  @Column({ type: 'varchar', length: 35, unique: true, nullable: false })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'password_hash',
  })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'password_salt',
  })
  passwordSalt: string;

  @Column({ type: 'varchar', length: 25, nullable: false, default: 'USER' })
  role: string;

  @ManyToMany(() => Project, (project: Project) => project.userAccounts, {
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'user_accounts_projects',
    joinColumn: {
      name: 'user_account_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
  })
  projects: Project[];

  @OneToMany(() => Project, (project: Project) => project.owner, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  ownedProjects: Project[];

  @OneToMany(() => Task, (task: Task) => task.id, {})
  tasks: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  constructor(
    firstname: string,
    lastname: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    role: string,
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.passwordHash = passwordHash;
    this.passwordSalt = passwordSalt;
    this.role = role;
  }
}
