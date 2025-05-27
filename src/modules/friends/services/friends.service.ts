import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponseDto, SuccessResponseDto } from 'src/common/response';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async followUser(userId: number, friendId: number) {
    try {
      if (userId === friendId)
        return new ErrorResponseDto('You Cannot Follow Yourself');

      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['friends'],
      });

      const friend = await this.userRepo.findOneBy({ id: friendId });

      if (!user || !friend)
        return new ErrorResponseDto('User or Friend Not Found');

      const alreadyFollowing = user.friends.some((f) => f.id == friendId);
      if (alreadyFollowing) return new ErrorResponseDto('Already Following');

      user.friends.push(friend);
      await this.userRepo.save(user);

      return new SuccessResponseDto(
        `User ${userId} is now following User ${friendId}`,
      );
    } catch (error) {
      return new ErrorResponseDto(`Error Following User ${error.message}`);
    }
  }

  async unfollowUser(userId: number, friendId: number) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['friends'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isFollowing = user.friends.some((f) => f.id === friendId);
      if (!isFollowing) {
        throw new BadRequestException('Not following this user');
      }

      user.friends = user.friends.filter((f) => f.id !== friendId);
      await this.userRepo.save(user);

      return new SuccessResponseDto(
        `User ${userId} has unfollowed User ${friendId}`,
      );
    } catch (error) {
      return new ErrorResponseDto(`Error UnFollowing user ${error.message} `);
    }
  }
}
