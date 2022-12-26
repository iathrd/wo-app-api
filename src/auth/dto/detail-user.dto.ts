import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDetailUser {
  picture: File;

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
  @IsNumber()
  @MinLength(5)
  @MaxLength(5)
  postCode: number;
}
