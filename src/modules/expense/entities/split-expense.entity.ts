import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Expense } from './expense.entity';
import { DateEntity } from 'src/common/entities/date_entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class SplitExpense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Expense, (expense) => expense.splits)
  @JoinColumn({ name: 'expense_id' })
  expense: Expense;
  
  @ManyToOne(() => User)
  paid_by: User;
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'owed_by' })
  owed_by: User;

  @Column('float')
  amount: number;

  @Column({ default: false })
  is_settled: boolean;

  @Column({nullable : true})
  settled_time: Date
}
