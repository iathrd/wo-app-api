import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Banner } from './entity/banner.entity';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/partner')
  getAllVendor() {
    return this.adminService.getAllVendor();
  }

  @Post('/banner')
  @UseInterceptors(FileInterceptor('file'))
  createBanner(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBannerDto: CreateBannerDto,
  ): Promise<Banner> {
    return this.adminService.createBanner(file, createBannerDto);
  }

  @Get('/banner')
  getBanner(): Promise<Banner[]> {
    return this.adminService.getBanner();
  }

  @Post('/partner/:id')
  updatePartner(
    @Body() updatePartnerDto: UpdatePartnerDto,
    @Param('id') id: string,
  ) {
    return this.adminService.updatePartner(updatePartnerDto, id);
  }
}
