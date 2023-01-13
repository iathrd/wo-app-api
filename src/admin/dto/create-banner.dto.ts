import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBannerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  endDate: Date;
}
