import { Module } from '@nestjs/common';
import { ExpenseService } from './services/expense.service';
import { ExpenseController } from './controllers/expense.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseCategory } from './entities/expense-category.entity';
import { JwtModule } from '@nestjs/jwt';
import { ExpenseCategoryService } from './services/expense-category.service';
import { ExpenseCategoryController } from './controllers/expense-category.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, ExpenseCategory]),
    JwtModule.register({ secret: 'supersecret' }),
    AuthModule,
  ],
  providers: [ExpenseService, ExpenseCategoryService],
  controllers: [ExpenseController, ExpenseCategoryController],
})
export class ExpenseModule {}
