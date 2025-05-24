import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from '../entities/expense.entity';
import { Repository } from 'typeorm';
import { ErrorResponseDto, SuccessResponseDto } from 'src/common/response';
import { CreateExpenseDto } from '../dtos/create-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
  ) {}

  async createExpense(dto: CreateExpenseDto) {
    try {
      const newExpense = this.expenseRepo.create({
        expense_name: dto.expense_name,
        expense_amount: dto.expense_amount,
        expense_date: dto.expense_date,
        expense_method: dto.expense_method,
        expense_currency: dto.expense_currency ?? 'INR',
        expense_location: dto.expense_location,
        expense_note: dto.expense_note,
        expense_type: dto.expense_type,
        expense_category: { id: dto.expense_category_id },
        user: { id: dto.user_id },
      });

      await this.expenseRepo.save(newExpense);

      return new SuccessResponseDto('Expense Created Successfully', newExpense);
    } catch (error) {
      return new ErrorResponseDto(
        `Error Creating New Expense ${error.message}`,
      );
    }
  }

  async getExpensesByUserId(userId: number) {
    try {
      const expenses = await this.expenseRepo.find({
        where: { user_id: userId },
        relations: ['expense_category'],
        order: { expense_date: 'DESC' },
      });

      return new SuccessResponseDto('Expenses fetched successfully', expenses);
    } catch (error) {
      return new ErrorResponseDto(`Failed to fetch expenses: ${error.message}`);
    }
  }
}
