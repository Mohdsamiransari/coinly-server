import { Module } from '@nestjs/common';
import { FriendsService } from './services/friends.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { FriendsController } from './controllers/friends.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ secret: 'supersecret' }),
    UserModule,
  ],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
