import { Module } from '@nestjs/common';
import { config_module } from './configurations/config_module';
import { typeorm_config } from './configurations/typeorm_config';
import { UserAccountsModule } from './user_accounts/user_accounts.module';

@Module({
  imports: [config_module, typeorm_config, UserAccountsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
