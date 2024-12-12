import { Module } from '@nestjs/common';
import { configModule } from './configurations/configModule';
import { typeormConfig } from './configurations/typeormConfig';
import { UserAccountsModule } from './userAccounts/userAccounts.module';

@Module({
  imports: [configModule, typeormConfig, UserAccountsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
