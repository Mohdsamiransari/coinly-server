import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { ExpenseModule } from './modules/expense/expense.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Rezolut@123',
      database: 'coinly',
      entities: [User],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ExpenseModule,
  ],
})
export class AppModule {}
