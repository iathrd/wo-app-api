import { IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @MinLength(5)
  username: string;

  @MinLength(8)
  password: string;
}
