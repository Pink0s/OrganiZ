import {
  IsInt,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a task.
 */
export class CreateTaskDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(35)
  @ApiProperty({
    description: 'Task title',
    type: String,
    required: true,
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
    default: 'Task description',
  })
  description: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Project id',
    type: Number,
    required: true,
    default: 1,
  })
  projectId: number;
}
