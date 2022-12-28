import { IsString, MinLength } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @MinLength(6)
  verificationCode: string;

  @IsString()
  @MinLength(6)
  code: string;

  @IsString()
  @MinLength(5)
  username: string;
}
