import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto } from '../dtos/create-expense.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-expense')
  createExpense(@Body() dto: CreateExpenseDto) {
    return this.expenseService.createExpense(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  expenseByUserId(@Request() req: any) {
    return this.expenseService.getExpensesByUserId(req.user.sub);
  }
}
