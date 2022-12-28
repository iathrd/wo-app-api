import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @MinLength(5)
  businessName: string;

  @IsString()
  @MinLength(5)
  username: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEmail()
  @IsNotEmpty()
  businessEmail: string;

  @IsString()
  @MinLength(5)
  responsible: string;

  @IsPhoneNumber('ID')
  @MinLength(10)
  phoneNumber: string;

  @IsPhoneNumber('ID')
  @MinLength(10)
  whatsappNumber: string;

  @IsPhoneNumber('ID')
  @MinLength(10)
  companyPhoneNumber: string;

  @IsPhoneNumber('ID')
  @MinLength(10)
  companyWhatsappNumber: string;

  @IsString()
  @MinLength(3)
  bankName: string;

  @IsString()
  @MinLength(5)
  bankNumber;

  @IsString()
  @IsNotEmpty()
  ward: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  role: number;

  ktpPicture: string;
}
