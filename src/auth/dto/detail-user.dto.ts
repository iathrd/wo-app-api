import {
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDetailUserDto {
  picture: string;

  @IsOptional()
  @IsString()
  @MinLength(13)
  @MaxLength(13)
  phoneNumber: string;

  @IsOptional()
  @IsDate()
  birtDate: Date;

  @IsOptional()
  @IsString()
  @MinLength(3)
  province: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  city: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  address: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  postCode: string;
}
