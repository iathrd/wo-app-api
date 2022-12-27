import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @MinLength(5)
  businessName: string;

  @IsString()
  @MinLength(5)
  username: string;

  @MinLength(8)
  password: string;

  @IsEmail()
  companyEmail: string;

  @IsEmail()
  businessEmail: string;

  @IsString()
  @MinLength(5)
  responsible: string;

  @IsPhoneNumber('ID')
  phoneNumber: string;

  @IsPhoneNumber('ID')
  whatsappNumber: string;

  @IsPhoneNumber('ID')
  companyPhoneNumber: string;

  @IsPhoneNumber('ID')
  companyWhatsappNumber: string;

  @IsString()
  bankName: string;

  @IsString()
  bankNumber;

  role: number;

  ktpPicture: string;
}
