import { Module } from '@nestjs/common';
import { UserAccountsController } from './controllers/userAccounts.controller';
import { UserAccountsService } from './services/userAccounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from './entities/userAccount.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './guards/constants';
import { AuthGuard } from './guards/auth.guards';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccount]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserAccountsController],
  providers: [
    UserAccountsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [UserAccountsService],
})
export class UserAccountsModule {}
