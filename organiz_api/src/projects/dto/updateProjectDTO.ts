import { IsInt, IsNotEmpty, IsString, MaxLength, MinLength } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional } from "class-validator";

export class UpdateProjectDTO {
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

  @IsOptional()
  @ApiProperty({
    type: [Number],
    required: false,
    description: 'The project status',
    default: 1,
  })
  @IsInt()
  status: number;
}
