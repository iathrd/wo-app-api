import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class EditVendorDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  businessName: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEmail()
  businessEmail: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  responsible: string;

  @IsOptional()
  @IsPhoneNumber('ID')
  phoneNumber: string;

  @IsOptional()
  @IsPhoneNumber('ID')
  whatsappNumber: string;

  @IsOptional()
  @IsPhoneNumber('ID')
  companyPhoneNumber: string;

  @IsOptional()
  @IsPhoneNumber('ID')
  companyWhatsappNumber: string;

  @IsOptional()
  @IsString()
  bankName: string;

  @IsOptional()
  @IsString()
  bankNumber;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ward: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  district: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  province: string;
}
