import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Expense } from './expense.entity';

@Entity()
export class SplitExpense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Expense, { onDelete: 'CASCADE' })
  expense: Expense;

  @Column('float')
  amount: number;

  @Column({ default: false })
  is_settled: boolean;
}
