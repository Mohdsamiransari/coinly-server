import {
    Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from '../services/friends.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('follow')
  followUser(@Request() req: any, @Body('friend_id') friend_id: number) {
    console.log(friend_id);
    return this.friendsService.followUser(req.user.sub, friend_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unfollow')
  unfollowUser(@Request() req: any, @Body('friend_id') friend_id: number) {
    return this.friendsService.unfollowUser(req.user.sub, friend_id);
  }
}
