import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateExpenseCategoryDto } from '../dtos/create-expense-category.dto';
import { ExpenseCategoryService } from '../services/expense-category.service';

@Controller('expense-category')
export class ExpenseCategoryController {
  constructor(private expenseCategoryService: ExpenseCategoryService) {}

  @Post('create-category')
  createExpenseCategory(@Body() dto: CreateExpenseCategoryDto) {
    return this.expenseCategoryService.createExpenseCategory(dto);
  }

  @Get('all-Categories')
  getAllExpenseCategories() {
    return this.expenseCategoryService.getAllExpenseCategories();
  }

  @Delete('delete-category')
  deleteExpenseCategoryById(@Param('category_id') category_id: number) {
    return this.expenseCategoryService.deleteExpenseCategoryById(category_id);
  }
}
