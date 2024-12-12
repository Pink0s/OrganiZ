import { Module } from '@nestjs/common';
import { UserAccountsController } from './controllers/userAccounts.controller';
import { UserAccountsService } from './services/userAccounts.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAccount } from "./entities/userAccount.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount])],
  controllers: [UserAccountsController],
  providers: [UserAccountsService],
  exports: [UserAccountsService],
})
export class UserAccountsModule {}
