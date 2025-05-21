import { Injectable } from '@nestjs/common';
import { AuthDto, OtpVerificationDto, ResetPasswordDto } from '../dtos';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from 'src/modules/user/dtos';
import { ErrorResponseDto, SuccessResponseDto } from 'src/common/response';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon2.hash(dto.password);

    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser) return new ErrorResponseDto('User Already Exists');

    const user = this.userRepo.create({
      email: dto.email,
      hash: hash,
    });

    await this.userRepo.save(user);
    return new SuccessResponseDto(
      'User Created Successfully',
      new UserResponseDto(user),
    );
  }

  async signin(dto: AuthDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) return new ErrorResponseDto('No User Found With This Email');

    const isPasswordMatch = await argon2.verify(user.hash, dto.password);

    if (!isPasswordMatch) return new ErrorResponseDto('Password Did Not Match');

    const payload = { sub: user.id, email: user.email };

    const token = await this.jwtService.signAsync(payload);

    return new SuccessResponseDto('User Signed In SuccessFully', {
      access_token: token,
    });
  }

  async forgotPassword(dto: AuthDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) return new ErrorResponseDto('No User Found With This Email');

    const otp = Math.floor(100000 + Math.random() * 900000);

    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otp_expiration = otpExpiration;

    try {
      await this.userRepo.save(user);

      await this.mailService.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: 'Reset Password Token',
        text: `Your OTP (It expires in 5 minutes): ${otp}`,
      });

      return new SuccessResponseDto('OTP Send Successfully');
    } catch (error) {
      return new ErrorResponseDto(
        `Failed to send OTP, please try again. ${error}`,
      );
    }
  }

  async verifyOtp(dto: OtpVerificationDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) return new ErrorResponseDto('No User Found With This Email');

    const currentTime = new Date();

    if (user.otp != dto.otp || user.otp_expiration! < currentTime)
      return new ErrorResponseDto('Invalid or Expired OTP');

    return new SuccessResponseDto('OTP Verified');
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) return new ErrorResponseDto('No User Found With This Email');

    const currentTime = new Date();

    if (user.otp != dto.otp || user.otp_expiration! < currentTime)
      return new ErrorResponseDto('Invalid or Expired OTP');

    const hash = await argon2.hash(dto.newPassword);

    user.hash = hash;
    user.otp = null;
    user.otp_expiration = null;
    await this.userRepo.save(user);

    return new SuccessResponseDto('Password Reset Successfully');
  }
}
