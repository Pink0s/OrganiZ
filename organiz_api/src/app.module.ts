import { Module } from '@nestjs/common';
import { configModule } from './configurations/configModule';
import { typeormConfig } from './configurations/typeormConfig';
import { UserAccountsModule } from './userAccounts/userAccounts.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [configModule, typeormConfig, UserAccountsModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
