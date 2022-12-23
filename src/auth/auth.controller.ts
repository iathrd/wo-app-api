import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.authService.createUser(createUserDto);
  }

  @Get('/users/:id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.authService.getUser(id);
  }
}
