import { User } from 'src/modules/user/entities/user.entity';

export class FriendsResponseDto {
  id: number | undefined;
  email: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;

  constructor(user: Partial<User>) {
    this.id = user.id;
    this.email = user.email;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
  }
}
