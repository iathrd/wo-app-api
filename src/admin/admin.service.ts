import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorRepository } from 'src/auth/vendor.repository';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(VendorRepository)
    private vendorRepository: VendorRepository,
  ) {}

  async getAllVendor() {
    const query = this.vendorRepository.createQueryBuilder('vendor');
    const data = await query
      .addSelect(['vendor.ktpPicture', 'vendor.bankName', 'vendor.bankNumber'])
      .getMany();

    return data;
  }
}
