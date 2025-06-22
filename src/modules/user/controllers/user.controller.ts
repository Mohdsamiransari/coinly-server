import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from '../dtos';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  allUser() {
    return this.userService.getAllUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  singleUser(@Request() req: any) {
    return this.userService.getSingleUserById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/amount')
  getUserAmount(@Request() req: any) {
    return this.userService.getUserAmounts(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/change-password')
  changePassword(@Request() req, @Body('newPassword') newPassword: string) {
    const email = req.user.email;
    return this.userService.changePassword(email, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me/update")
  updateUser(@Request() req:any, @Body() dto:UpdateUserDto){
    return this.userService.updateUser(req.user.sub,dto)
  }

}
