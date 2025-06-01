import { User } from '../entities/user.entity';

export class UserResponseDto {
  id: number | undefined;
  email: string | undefined;

  first_name: string | undefined;
  last_name: string | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  total_balance: number | undefined;
  total_debit: number | undefined;
  total_credit: number | undefined;
  qr_code: string | undefined;

  constructor(user: Partial<User>) {
    this.id = user.id;
    this.email = user.email;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.total_balance = user.total_balance;
    this.total_debit = user.total_debit;
    this.total_credit = user.total_credit;
    this.qr_code = user.qr_code;
  }
}
