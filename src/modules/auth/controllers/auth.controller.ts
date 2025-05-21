import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto, OtpVerificationDto, ResetPasswordDto } from '../dtos';
import * as argon2 from 'argon2';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: AuthDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('verify-password')
  verifyPassword(@Body() dto: OtpVerificationDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
