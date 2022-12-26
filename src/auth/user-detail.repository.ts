import { EntityRepository, Repository } from 'typeorm';
import { UserDetail } from './user-detail.entity';

@EntityRepository(UserDetail)
export class UserDetailRepository extends Repository<UserDetail> {}
