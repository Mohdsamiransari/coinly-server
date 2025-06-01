import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from '../entities/expense.entity';
import { DataSource, Repository } from 'typeorm';
import { ErrorResponseDto, SuccessResponseDto } from 'src/common/response';
import { CreateExpenseDto } from '../dtos/create-expense.dto';
import { SplitExpense } from '../entities/split-expense.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
    @InjectRepository(SplitExpense)
    private sliptRepo: Repository<SplitExpense>,
    private dataSource: DataSource,
  ) {}

  async createExpense(dto: CreateExpenseDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create the expense entity
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

      const savedExpense = await queryRunner.manager.save(newExpense);

      // 2. Handle expense splits
      if (dto.splits?.length) {
        for (const split of dto.splits) {
          const splitRecord = this.sliptRepo.create({
            amount: split.amount,
            paid_by: { id: dto.user_id },
            owed_by: { id: split.friend_id },
            expense: { id: savedExpense.id },
          });
          await queryRunner.manager.save(splitRecord);
        }
      }

      await queryRunner.commitTransaction();
      return new SuccessResponseDto(
        'Expense Created Successfully',
        savedExpense,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ErrorResponseDto(
        `Error Creating New Expense: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getExpensesByUserId(userId: number) {
    try {
      const expenses = await this.expenseRepo.find({
        where: { user_id: userId },
        relations: ['expense_category','splits','splits.owed_by'],
        order: { expense_date: 'DESC' },
      });

      return new SuccessResponseDto('Expenses fetched successfully', expenses);
    } catch (error) {
      return new ErrorResponseDto(`Failed to fetch expenses: ${error.message}`);
    }
  }

  async getExpenseDetail(expenseId: number) {
    try {
      const expense = await this.expenseRepo.findOne({
        where: { id: expenseId },
        relations: ['expense_category','splits'],
      });

      if (!expense)
        return new ErrorResponseDto(`No Expense Found With This Id`);

      return new SuccessResponseDto('Expense Found Successfully', expense);
    } catch (error) {
      return new ErrorResponseDto(
        `Failed To Fetch Expense Detail: ${error.message}`,
      );
    }
  }
}
