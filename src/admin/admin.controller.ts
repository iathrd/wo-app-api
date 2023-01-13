import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleEnum } from 'src/auth/dto/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { HasRoles } from 'src/auth/roles.decorator';
import { AdminService } from './admin.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Banner } from './entity/banner.entity';

@HasRoles(RoleEnum.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
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
