import {
  IsString,
  IsInt,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for creating a project.
 */
export class CreateProjectDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(55)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 55,
    description: 'The name of the project',
    default: 'Project x',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The description of the project',
    default: 'Project x za  zaeaez eaz e azeeza zae aezzea',
  })
  description: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    type: [Number],
    required: false,
    description: 'The categories of the project',
    default: [2, 3],
  })
  @IsInt({ each: true })
  categories: number[];
}
