import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CreateDetailUserDto } from './dto/detail-user.dto';
import { SignInDto } from './dto/signin.dto';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { User } from './entity/user.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UserDetail } from './entity/user-detail.entity';
import { EditVendorDto } from './dto/edit-vendor-dto';
import { RolesGuard } from './guard/roles.guard';
import { HasRoles } from './roles.decorator';
import { RoleEnum } from './dto/role.enum';
import { Vendor } from './entity/vendor.entity';
import { ChangeDataDto } from './dto/change-data.dto';
import { VerifyEmailDto } from './dto/verification-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.validateUser(signInDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.authService.createUser(createUserDto);
  }

  @Get('/users/:id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.authService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/users/detail')
  @UseInterceptors(FileInterceptor('file'))
  async createUserDetail(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDetailDto: CreateDetailUserDto,
    @GetUser() user: User,
  ): Promise<UserDetail> {
    return this.authService.createUserDetail(createUserDetailDto, user, file);
  }

  @Post('/signup/vendor')
  @UseInterceptors(FileInterceptor('file'))
  signupVendor(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVendorDto: CreateVendorDto,
  ): Promise<void> {
    return this.authService.createVendor(createVendorDto, file);
  }

  @HasRoles(RoleEnum.Partner)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/vendor')
  editVendor(@Body() editVendorDto: EditVendorDto, @GetUser() vendor: Vendor) {
    return this.authService.editVendor(editVendorDto, vendor);
  }

  @Post('/ressetData')
  ressetData(@Body() changeDataDto: ChangeDataDto) {
    return this.authService.ressetData(changeDataDto);
  }

  @Post('/verifyEmail')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }
}
