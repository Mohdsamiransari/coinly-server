import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ResetPasswordDto } from 'src/modules/auth/dtos';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  allUser() {
    return this.userService.getAllUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get('single-user')
  singleUser(@Request() req: any) {
    return this.userService.getSingleUserById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Request() req, @Body('newPassword') newPassword: string) {
    const email = req.user.email
    return this.userService.changePassword(email, newPassword);
  }
}
