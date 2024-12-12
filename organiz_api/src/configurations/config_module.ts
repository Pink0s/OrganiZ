import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';

export const config_module: Promise<DynamicModule> = ConfigModule.forRoot({
  cache: true,
  isGlobal: true,
  ignoreEnvFile: false,
  validate,
});
