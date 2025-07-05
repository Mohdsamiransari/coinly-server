import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import { User } from './modules/user/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { FriendsModule } from './modules/friends/friends.module';
import { Friends } from './modules/friends/entities/friends.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 11092,
      username: 'avnadmin',
      password: process.env.DB_PASSWORD,
      database: 'defaultdb',
      entities: [User],
      synchronize: true,
      ssl: {
        ca: fs.readFileSync(__dirname + '/../ssl/ca.pem').toString(),
        rejectUnauthorized: true,
      },
    }),
    AuthModule,
    UserModule,
    ExpenseModule,
    FriendsModule,
  ],
})
export class AppModule {}
