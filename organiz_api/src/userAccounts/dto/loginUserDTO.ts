import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'User email',
    default: 'toto.durand@test.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'User password',
    default: 'Strong-Password1',
  })
  password: string;
}
