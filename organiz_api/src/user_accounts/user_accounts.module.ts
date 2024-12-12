import { Module } from '@nestjs/common';
import { UserAccountsController } from './controllers/user_accounts.controller';
import { UserAccountsService } from './services/user_accounts.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAccount } from "./entities/user_account.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount])],
  controllers: [UserAccountsController],
  providers: [UserAccountsService],
  exports: [UserAccountsService],
})
export class UserAccountsModule {}
