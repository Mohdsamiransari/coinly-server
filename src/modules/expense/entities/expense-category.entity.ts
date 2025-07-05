import { DateEntity } from 'src/common/entities/date_entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExpenseCategory extends DateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  icon: string;

  @Column({ unique: true })
  name: string;
}
