import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorResponseDto, SuccessResponseDto } from 'src/common/response';
import { ExpenseCategory } from '../entities/expense-category.entity';
import { CreateExpenseCategoryDto } from '../dtos/create-expense-category.dto';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpenseCategoryService {
  constructor(
    @InjectRepository(ExpenseCategory)
    private expenseCategoryRepo: Repository<ExpenseCategory>,
    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
  ) {}

  async createExpenseCategory(dto: CreateExpenseCategoryDto) {
    try {
      const existing = await this.expenseCategoryRepo.findOne({
        where: { name: dto.name },
      });

      if (existing) {
        return new ErrorResponseDto(
          'This Expense Category Name Already Exists',
        );
      }

      const newCategory = this.expenseCategoryRepo.create({
        name: dto.name,
        icon: dto.icon || 'default-icon',
      });

      await this.expenseCategoryRepo.save(newCategory);

      return new SuccessResponseDto(
        'Expense Category Created Successfully',
        newCategory,
      );
    } catch (error) {
      return new ErrorResponseDto(
        `Error Creating New Expense Category: ${error.message}`,
      );
    }
  }

  async getAllExpenseCategories() {
    try {
      const allExpenseCategories = await this.expenseCategoryRepo.find({
        order: { createdAt: 'DESC' },
      });
      return new SuccessResponseDto(
        'Expense Categories Fetched Successfully',
        allExpenseCategories,
      );
    } catch (error) {
      return new ErrorResponseDto(
        `Error Getting All Expense Categories: ${error.message}`,
      );
    }
  }

  async deleteExpenseCategoryById(categoryId: number) {
    try {
      const relatedExpenses = await this.expenseRepo.find({
        where: { expense_category_id: categoryId },
      });

      if (relatedExpenses) {
        return new SuccessResponseDto(
          'Expense Category Deleted Successfully',
          relatedExpenses,
        );
      }

      await this.expenseCategoryRepo.delete(categoryId);

      return new SuccessResponseDto('Expense Category Deleted Successfully');
    } catch (error) {
      return new ErrorResponseDto(
        `Error Deleting Expense Category: ${error.message}`,
      );
    }
  }
}
