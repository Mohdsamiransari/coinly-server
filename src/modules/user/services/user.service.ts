import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ErrorResponseDto, SuccessResponseDto } from 'src/common/response';
import { UpdateUserDto, UserResponseDto } from '../dtos';
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

    if (!users) return new SuccessResponseDto('No user found', []);

    return new SuccessResponseDto('Users Find Successfully', users);
  }

  // Get Single User
  async getSingleUserById(userId: number) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
      });

      if (!user)
        throw new NotFoundException(`User Not Found With Id ${userId}`);

      return new SuccessResponseDto(
        'User Found Successfully',
        new UserResponseDto(user),
      );
    } catch (error) {
      return new ErrorResponseDto('Invalid or Expired Token');
    }
  }

  // Get All Friends

  // Change User Password
  async changePassword(email: string, newPassword: string) {
    try {
      const user = await this.userRepo.findOne({ where: { email: email } });

      if (!user)
        throw new NotFoundException(`User Not Found With This Email ${email}`);

      const hash = await argon2.hash(newPassword);

      user.hash = hash;
      user.otp = null;
      user.otp_expiration = null;
      await this.userRepo.save(user);

      return new SuccessResponseDto('Password Reset Successfully');
    } catch (error) {
      return new ErrorResponseDto('Error Changing Password');
    }
  }

  async getUserAmounts(userId: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });

      if (!user)
        return new SuccessResponseDto('Error Getting User Expense Amount', {
          total_balance: 0,
          total_credit: 0,
          total_debit: 0,
        });

      return new SuccessResponseDto('User Expense Amount', {
        total_balance: user?.total_balance,
        total_credit: user?.total_credit,
        total_debit: user?.total_debit,
      });
    } catch (error) {
      return new ErrorResponseDto('Error Getting User Expense Amount', {
        total_balance: 0,
        total_credit: 0,
        total_debit: 0,
      });
    }
  }

  // Update User Service
  async updateUser(userId: number, dto: UpdateUserDto) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });

      if (!user)
        throw new NotFoundException(`User not found with this id ${userId}`);

      let isModified = false;

      if (dto.qr_code !== undefined && dto.qr_code !== user.qr_code) {
        user.qr_code = dto.qr_code;
        isModified = true;
      }

      if (dto.first_name !== undefined && dto.first_name !== user.first_name) {
        user.first_name = dto.first_name;
        isModified = true;
      }

      if (dto.last_name !== undefined && dto.last_name !== user.last_name) {
        user.last_name = dto.last_name;
        isModified = true;
      }

      if (!isModified) {
        return new SuccessResponseDto(
          'No changes detected.',
          new UserResponseDto(user),
        );
      }
      const updatedUser = await this.userRepo.save(user);

      return new SuccessResponseDto(
        'User updated successfully',
        new UserResponseDto(updatedUser),
      );
    } catch (error) {
      return new ErrorResponseDto('Error Updating User Data');
    }
  }
}
