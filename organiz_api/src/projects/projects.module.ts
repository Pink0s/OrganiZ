import { Module } from '@nestjs/common';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UserAccount } from '../userAccounts/entities/userAccount.entity';
import { Category } from '../categories/entities/category.entity';
import { Status } from '../statuses/entities/status.entity';
import { UserAccountsService } from '../userAccounts/services/userAccounts.service';
import { CategoriesService } from '../categories/services/categories.service';
import { StatusesService } from '../statuses/services/statuses.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount, Project, Category, Status])],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    UserAccountsService,
    CategoriesService,
    StatusesService,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
