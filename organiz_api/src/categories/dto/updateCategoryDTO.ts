import { IsNotEmpty, MaxLength, MinLength } from '@nestjs/class-validator';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(35)
  @MinLength(1)
  @ApiProperty({
    type: String,
    description: 'Category name',
    default: 'new',
  })
  name: string;
}
