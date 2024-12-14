import { IsString } from 'class-validator';
import { IsNotEmpty, MaxLength, MinLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a status.
 */
export class CreateStatusDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(25)
  @ApiProperty({
    description: 'Id of the create status',
    default: 'todo',
    maxLength: 25,
    minLength: 1,
  })
  name: string;
}
