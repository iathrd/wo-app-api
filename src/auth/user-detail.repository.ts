import { EntityRepository, Repository } from 'typeorm';
import { UserDetail } from './entity/user-detail.entity';

@EntityRepository(UserDetail)
export class UserDetailRepository extends Repository<UserDetail> {}
