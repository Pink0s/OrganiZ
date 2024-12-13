import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(35)
  @ApiProperty({
    type: String,
    description: 'Category name',
    default: 'new',
  })
  name: string;
}
