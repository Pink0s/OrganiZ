import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserAccount } from '../user_accounts/entities/user_account.entity';
import { Task } from '../tasks/entities/task.entity';
import { Category } from '../categories/entities/category.entity';
import { Status } from '../statuses/entities/status.entity';
import { Project } from '../projects/entities/project.entity';

export const typeorm_config: DynamicModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    entities: [UserAccount, Task, Category, Status, Task, Project],
    synchronize: true,
  }),
});
