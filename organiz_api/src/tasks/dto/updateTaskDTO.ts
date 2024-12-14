import {
  IsInt,
  MaxLength,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for updating a task.
 */
export class UpdateTaskDTO {
  @IsOptional()
  @IsString()
  @MaxLength(35)
  @ApiProperty({
    description: 'Task title',
    type: String,
    required: false,
    default: 'Task title',
    maxLength: 35,
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Task description',
    type: String,
    required: false,
    default: 'Task title',
  })
  description: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    description: 'Status id',
    type: Number,
    required: false,
    default: 2,
  })
  statusId: number;
}
