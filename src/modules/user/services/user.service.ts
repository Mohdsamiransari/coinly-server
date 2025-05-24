import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ErrorResponseDto, SuccessResponseDto } from 'src/common/response';
import { UserResponseDto } from '../dtos';
import * as argon2 from 'argon2';
@Injectable({})
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // Get All User
  async getAllUser() {
    const users = await this.userRepo.find();

    if (!users) return new SuccessResponseDto('No user found');

    return new SuccessResponseDto('Users Find Successfully', users);
  }

  // Get Single User
  async getSingleUserById(userId: number) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
      });

      if (!user) return new ErrorResponseDto('No user found');

      return new SuccessResponseDto(
        'User Found Successfully',
        new UserResponseDto(user),
      );
    } catch (error) {
      return new ErrorResponseDto('Invalid or Expired Token');
    }
  }

  // Change User Password
  async changePassword(email: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { email: email } });

    if (!user) return new ErrorResponseDto('No User Found With This Email');

    const hash = await argon2.hash(newPassword);

    user.hash = hash;
    user.otp = null;
    user.otp_expiration = null;
    await this.userRepo.save(user);

    return new SuccessResponseDto('Password Reset Successfully');
  }

  // Update User Service
}
