import { User } from "src/modules/user/entities/user.entity";
import { FriendsResponseDto } from "./friends-response.dto";

export class FriendListResponseDto {
  friends: FriendsResponseDto[];

  constructor(users: Partial<User>[]) {
    this.friends = users.map((user) => new FriendsResponseDto(user));
  }
}
