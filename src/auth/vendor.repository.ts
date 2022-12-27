import { EntityRepository, Repository } from 'typeorm';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { Vendor } from './entity/vendor.entity';
import * as argon2 from 'argon2';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(Vendor)
export class VendorRepository extends Repository<Vendor> {
  async careteVendor(createVendorDto: CreateVendorDto): Promise<void> {
    const { password, role } = createVendorDto;
    const hashedPassword = await argon2.hash(password);

    const user = this.create({
      ...createVendorDto,
      role: +role,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exist');
      } else if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
