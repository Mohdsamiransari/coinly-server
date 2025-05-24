import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class DateEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
