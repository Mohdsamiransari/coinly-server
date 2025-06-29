import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import { User } from './modules/user/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'coinly-samirmohd701-c0b1.c.aivencloud.com',
      port: 11092,
      username: 'avnadmin',
      password: 'AVNS_Xaq0CjwHix7W29kyyAt',
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
  ],
})
export class AppModule {}
