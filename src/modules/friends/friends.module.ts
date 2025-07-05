import { Module } from '@nestjs/common';
import { FriendsService } from './services/friends.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsController } from './controllers/friends.controller';
import { Friends } from './entities/friends.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friends, User]),
    JwtModule.register({ secret: 'supersecret' }),
    UserModule,
  ],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
