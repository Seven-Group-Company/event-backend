import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-user')
  createUser(@Body() dto: AuthDto) {
    return this.authService.createUser(dto);
  }

  @Post('login')
  loginUser(@Body() dto: AuthDto) {
    return this.authService.loginUser(dto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: AuthDto) {
    return this.authService.verifyOTP(dto);
  }

  @Post('verify-mfa')
  verifyMfa(@Body() dto: AuthDto) {
    return this.authService.verifyMFA(dto);
  }
}
