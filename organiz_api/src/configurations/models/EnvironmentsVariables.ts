import { IsNumber, IsString, Max, Min } from 'class-validator';

export class EnvironmentsVariables {
  @IsString()
  DATABASE_TYPE: string;

  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  LOGGING_LEVEL: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  HTTP_LISTENING_PORT: number;
}
