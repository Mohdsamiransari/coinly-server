import { DateEntity } from 'src/common/entities/date_entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Friends extends DateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  friendId: number;

  @Column()
  status: string;
  
}