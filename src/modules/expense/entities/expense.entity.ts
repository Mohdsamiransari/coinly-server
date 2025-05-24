import { DateEntity } from 'src/common/entities/date_entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExpenseCategory } from './expense-category.entity';

export enum ExpenseType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum ExpenseMethod {
  CASH = 'cash',
  UPI = 'upi',
  CARD = 'card',
  NET_BANKING = 'net_banking',
}

@Entity()
export class Expense extends DateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expense_name: string;

  @Column({ type: 'date' })
  expense_date: Date;

  @Column({ nullable: true, type: 'text' })
  expense_note: string;

  @Column({ default: 'INR' })
  expense_currency: string;

  @Column({ type: 'enum', enum: ExpenseMethod })
  expense_method: ExpenseMethod;

  @Column({ nullable: true })
  expense_location: string;

  @Column({ type: 'float' })
  expense_amount: number;

  @Column({ type: 'enum', enum: ExpenseType })
  expense_type: ExpenseType;

  @Column()
  expense_category_id: number;

  @ManyToOne(() => ExpenseCategory)
  @JoinColumn({ name: 'expense_category_id' })
  expense_category: ExpenseCategory;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
