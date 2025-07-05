import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponseDto, SuccessResponseDto } from 'src/common/response';
import { In, Repository } from 'typeorm';
import { Friends } from '../entities/friends.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { FriendsResponseDto } from '../dtos';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private friendsRepo: Repository<Friends>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async followUser(userId: number, friendId: number) {
    try {
      if (userId === friendId)
        return new ErrorResponseDto('You Cannot Follow Yourself');

      const user = await this.userRepo.findOneBy({ id: userId });

      if (!user) return new ErrorResponseDto('User Not Found');

      const friend = await this.userRepo.findOneBy({ id: friendId });
      if (!friend) return new ErrorResponseDto('Friend Not Found');

      const alreadyFollowing = await this.friendsRepo.findOneBy({
        userId: userId,
        friendId: friendId,
      });

      if (alreadyFollowing) return new ErrorResponseDto('Already Following');

      await this.friendsRepo.save({
        userId: userId,
        friendId: friendId,
        status: 'following',
      });

      return new SuccessResponseDto(
        `User ${userId} is now following User ${friendId}`,
      );
    } catch (error) {
      return new ErrorResponseDto(`Error Following User ${error.message}`);
    }
  }

  async unfollowUser(userId: number, friendId: number) {
    try {
      const user = await this.userRepo.findOneBy({
        id: userId,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isFollowing = await this.friendsRepo.findOneBy({
        userId: userId,
        friendId: friendId,
      });

      if (!isFollowing) return new ErrorResponseDto('Not Following');

      await this.friendsRepo.delete({ userId: userId, friendId: friendId });

      return new SuccessResponseDto(
        `User ${userId} has unfollowed User ${friendId}`,
      );
    } catch (error) {
      return new ErrorResponseDto(`Error UnFollowing user ${error.message} `);
    }
  }

  async getAllFriends(userId: number) {
    try {
      const friendships = await this.friendsRepo.find({
        where: { userId },
      });

      if (friendships.length === 0) {
        return new SuccessResponseDto('No Friends Found', []);
      }

      const friendIds = friendships.map((f) => f.friendId);
      const friends = await this.userRepo.findBy({ id: In(friendIds) });

      const friendResponseDtos = friends.map(
        (friend) => new FriendsResponseDto(friend),
      );
      return new SuccessResponseDto(
        'Friends retrieved successfully',
        friendResponseDtos,
      );
    } catch (error) {
      return new ErrorResponseDto(`Error Finding All Friends ${error.message}`);
    }
  }
}
