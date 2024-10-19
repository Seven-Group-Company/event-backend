import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto';
import { Public } from './custom-decorators/public.decoratot';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('create-user')
  createUser(@Body() dto: AuthDto) {
    return this.authService.createUser(dto);
  }

  @Public()
  @Post('login')
  loginUser(@Body() dto: AuthDto) {
    return this.authService.loginUser(dto);
  }

  @Public()
  @Post('verify-otp')
  verifyOtp(@Body() dto: AuthDto) {
    return this.authService.verifyOTP(dto);
  }
}
