import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CreateDetailUser } from './dto/detail-user.dto';
import { SignInDto } from './dto/signin.dto';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.validateUser(signInDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
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
    @Body() createUserDetailDto: CreateDetailUser,
    @GetUser() user: User,
  ) {
    return this.authService.createUserDetail(createUserDetailDto, user, file);
  }
}
