import { User } from '../entities/user.entity';

export class UserResponseDto {
  id: number | undefined;
  email: string | undefined;

  first_name: string | undefined;
  last_name: string | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  constructor(user: Partial<User>) {
    this.id = user.id;
    this.email = user.email;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
