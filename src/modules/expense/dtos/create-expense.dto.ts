import {
  IsArray,
  IsDate,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ExpenseMethod, ExpenseType } from '../entities/expense.entity';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsString()
  expense_name: string;

  
  @Type(()=> Date)
  @IsDate()
  expense_date: Date;

  @IsOptional()
  @IsString()
  expense_note?: string;

  @IsOptional()
  @IsString()
  expense_currency?: string;

  @IsEnum(ExpenseMethod)
  expense_method: ExpenseMethod;

  @IsOptional()
  @IsString()
  expense_location?: string;

  @IsNumber()
  expense_amount: number;

  @IsEnum(ExpenseType)
  expense_type: ExpenseType;

  @IsNumber()
  expense_category_id: number;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(()=> SplitDto)
  splits: SplitDto[]
}


export class SplitDto{
  @IsNumber()
  friend_id: number;
  @IsNumber()
  amount: number;
}