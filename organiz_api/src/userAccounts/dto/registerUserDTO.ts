import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsString,
  IsEmail,
} from '@nestjs/class-validator';
import { IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for registering a user.
 * Validates the structure and content of user registration input.
 */
export class RegisterUserDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(25)
  @ApiProperty({
    type: String,
    description: 'User firstname',
    maxLength: 25,
    minLength: 1,
    default: 'Toto',
  })
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(25)
  @ApiProperty({
    type: String,
    description: 'User lastname',
    maxLength: 25,
    minLength: 1,
    default: 'Durand',
  })
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(35)
  @ApiProperty({
    type: String,
    description: 'User email',
    maxLength: 35,
    minLength: 1,
    default: 'toto.durand@test.com',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(14)
  @MaxLength(80)
  @IsStrongPassword()
  @ApiProperty({
    type: String,
    description: 'User password',
    maxLength: 80,
    minLength: 14,
    default: 'Strong-Password1',
  })
  password: string;
}
