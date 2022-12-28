import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ChangeTypeEnum } from './type-change.enum';

export class ChangeDataDto {
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  type: ChangeTypeEnum;
}
