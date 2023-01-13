import { IsNotEmpty } from 'class-validator';

export class UpdatePartnerDto {
  @IsNotEmpty()
  isAdminVerify: boolean;

  @IsNotEmpty()
  isEmailVerify: boolean;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  rejectedReason: string;
}
