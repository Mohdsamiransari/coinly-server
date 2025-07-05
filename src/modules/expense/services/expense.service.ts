import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from '../entities/expense.entity';
import { DataSource, In, Repository } from 'typeorm';
import { ErrorResponseDto, SuccessResponseDto } from 'src/common/response';
import { CreateExpenseDto } from '../dtos/create-expense.dto';
import { SplitExpense } from '../entities/split-expense.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { UpdateExpenseDto } from '../dtos/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
    @InjectRepository(SplitExpense)
    private sliptRepo: Repository<SplitExpense>,
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createExpense(userId: number,dto: CreateExpenseDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepo.findOneBy({ id: userId });

      if (!user) return new ErrorResponseDto('No User found');

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
        user: { id: userId },
      });

      const savedExpense = await queryRunner.manager.save(newExpense);

      // 2. Handle expense splits
      if (dto.splits?.length) {
        const splitsToSave = dto.splits.map((split) =>
          this.sliptRepo.create({
            amount: split.amount,
            paid_by: { id: userId },
            owed_by: { id: split.friend_id },
            expense: { id: savedExpense.id },
          }),
        );

        await queryRunner.manager.save(splitsToSave);
      }

      const isCredit = dto.expense_type.toLowerCase() === 'credit';
      const isDebit = dto.expense_type.toLowerCase() === 'debit';

      const prevBalance = user.total_balance ?? 0;
      const prevCredit = user.total_credit ?? 0;
      const prevDebit = user.total_debit ?? 0;
      const updateResult = await queryRunner.manager.update(
        User, // or your user entity class
        { id: userId },
        {
          total_balance: isCredit
            ? prevBalance + dto.expense_amount
            : prevBalance - dto.expense_amount,
          total_credit: isCredit ? prevCredit + dto.expense_amount : prevCredit,
          total_debit: isDebit ? prevDebit + dto.expense_amount : prevDebit,
        },
      );

      if (updateResult.affected === 0) {
        throw new Error('User update failed');
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
        relations: ['expense_category', 'splits', 'splits.owed_by'],
        order: { expense_date: 'DESC' },
      });

      return new SuccessResponseDto('Expenses fetched successfully', expenses);
    } catch (error) {
      return new ErrorResponseDto(`Failed to fetch expenses: ${error.message}`);
    }
  }

  async getExpenseDetail(expenseId: number) {
    try {
      console.log(expenseId);
      const expense = await this.expenseRepo.findOne({
        where: { id: expenseId },
        relations: ['expense_category', 'splits', 'splits.owed_by'],
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

  async deleteAllExpenseByUserId(userId: number) {
    try {
      const expenses = await this.expenseRepo.find({
        where: { user_id: userId },
        relations: ['expense_category', 'splits', 'splits.owed_by'],
      });

      if (!expenses) return new ErrorResponseDto('No Expense Found', []);

      const expenseIds = expenses.map((exp) => exp.id);
      const splitIds = expenses.flatMap((exp) =>
        exp.splits.map((split) => split.id),
      );

      if (splitIds.length) {
        await this.sliptRepo.delete({ id: In(splitIds) });
      }

      await this.expenseRepo.delete({ id: In(expenseIds) });

      return new SuccessResponseDto('All Expense Deleted Successfully', {
        deletedExpenses: expenseIds,
        deletedSplits: splitIds,
      });
    } catch (error) {
      new ErrorResponseDto(`Error Deleting All Expense Of User ${userId}`);
    }
  }

  async deleteExpenseById(expenseId: number) {
    try {
      const expense = await this.expenseRepo.findOne({
        where: { id: expenseId },
        relations: ['expense_category', 'splits'],
      });

      if (!expense)
        return new ErrorResponseDto(`No Expense Found With Id ${expenseId}`);

      const splitIds = expense?.splits.flatMap((split) => split.id);

      if (splitIds?.length) {
        await this.sliptRepo.delete({ id: In(splitIds) });
      }
      await this.expenseRepo.delete({ id: expense?.id });

      return new SuccessResponseDto('Expense Deleted Successfully', {
        deleteExpenseId: expense?.id,
        deletedSplitIds: splitIds,
      });
    } catch (error) {
      new ErrorResponseDto(`Error Deleting Expense ${expenseId}`);
    }
  }

  async updateExpenseById(expenseId: number, dto: UpdateExpenseDto) {
    try {
      // 1. Update the expense fields
      const updateResult = await this.expenseRepo.update(
        { id: expenseId },
        {
          expense_name: dto.expense_name,
          expense_date: dto.expense_date,
          expense_note: dto.expense_note,
          expense_currency: dto.expense_currency ?? 'INR',
          expense_method: dto.expense_method,
          expense_location: dto.expense_location,
          expense_amount: dto.expense_amount,
          expense_type: dto.expense_type,
          expense_category_id: dto.expense_category_id,
        },
      );

      // 2. Check if expense exists
      if (updateResult.affected === 0) {
        return new ErrorResponseDto(`Expense not found with id ${expenseId}`);
      }

      // 3. Update splits (replace existing with new)
      if (dto.splits) {
        const expense = await this.expenseRepo.findOne({
          where: { id: expenseId },
          relations: ['splits'],
        });

        if (!expense) {
          return new ErrorResponseDto(`Expense not found with id ${expenseId}`);
        }

        // Remove old splits (if any)
        if (expense.splits?.length) {
          await this.sliptRepo.remove(expense.splits);
        }

        // Assign new splits
        expense.splits = dto.splits.map((split) =>
          this.sliptRepo.create({ ...split, expense: { id: expenseId } }),
        );

        await this.expenseRepo.save(expense);
      }

      // 4. Fetch updated expense with relations using QueryBuilder
      const updatedExpense = await this.expenseRepo.findOne({
        where: { id: expenseId },
        relations: ['expense_category', 'splits'],
      });
      // .createQueryBuilder('expense')
      // .leftJoinAndSelect('expense.expense_category', 'expense_category')
      // .leftJoinAndSelect('expense.splits', 'splits')
      // .where('expense.id = :expenseId', { expenseId })
      // .getOne();

      return new SuccessResponseDto(
        'Expense updated successfully',
        updatedExpense,
      );
    } catch (error) {
      console.error('Update Expense Error:', error);
      return new ErrorResponseDto('Error updating expense');
    }
  }
}
