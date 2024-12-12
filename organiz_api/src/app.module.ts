import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config_module } from './configurations/config_module';
import { typeorm_config } from './configurations/typeorm_config';

@Module({
  imports: [config_module, typeorm_config],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
