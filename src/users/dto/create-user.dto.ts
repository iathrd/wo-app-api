import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  username: string;

  @MinLength(8)
  password: string;

  @IsEmail()
  email: string;

  @MinLength(1)
  role: number;
}
