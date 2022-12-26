import { EntityRepository, Repository } from 'typeorm';
import { CreateDetailUser } from './dto/detail-user.dto';
import { UserDetail } from './user-detail.entity';
import { User } from './user.entity';

@EntityRepository(UserDetail)
export class UserDetailRepository extends Repository<UserDetail> {
  async craeteUserDetail(
    createDetailDto: CreateDetailUser,
    user: User,
  ): Promise<void> {
    console.log(user);
  }
}
