import { IsString } from 'class-validator';

export class CreateExpenseCategoryDto {
  @IsString()
  name: string;

  @IsString()
  icon: string;
}
