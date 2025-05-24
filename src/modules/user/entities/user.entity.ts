import { DateEntity } from 'src/common/entities/date_entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends DateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  first_name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column()
  hash: string;

  @Column({ type: 'int', nullable: true })
  otp: number | null;

  @Column({ type: 'datetime', nullable: true })
  otp_expiration: Date | null;
}
