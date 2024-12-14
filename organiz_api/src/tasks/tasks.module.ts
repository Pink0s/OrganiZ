import { Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { ProjectsService } from '../projects/services/projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Status } from '../statuses/entities/status.entity';
import { UserAccount } from '../userAccounts/entities/userAccount.entity';
import { Project } from '../projects/entities/project.entity';
import { Category } from '../categories/entities/category.entity';
import { UserAccountsService } from '../userAccounts/services/userAccounts.service';
import { StatusesService } from '../statuses/services/statuses.service';
import { CategoriesService } from '../categories/services/categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, UserAccount, Project, Category, Status]),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    ProjectsService,
    UserAccountsService,
    StatusesService,
    CategoriesService,
  ],
  exports: [TasksService],
})
export class TasksModule {}
