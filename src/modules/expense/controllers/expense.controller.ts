import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto } from '../dtos/create-expense.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UpdateExpenseDto } from '../dtos/update-expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-expense')
  createExpense(@Request() req: any, @Body() dto: CreateExpenseDto) {
    return this.expenseService.createExpense(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  expenseByUserId(@Request() req: any) {
    return this.expenseService.getExpensesByUserId(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('detail')
  getExpenseDetail(@Query('expense_id') expense_id: number) {
    return this.expenseService.getExpenseDetail(expense_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-all')
  deleteAllExpenseByUserId(@Request() req: any) {
    return this.expenseService.deleteAllExpenseByUserId(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  deleteExpenseById(@Query('expense_id') expense_id: number) {
    return this.expenseService.deleteExpenseById(expense_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:expense_id')
  updateExpenseById(
    @Param('expense_id') expenseId: number,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expenseService.updateExpenseById(expenseId, dto);
  }
}
