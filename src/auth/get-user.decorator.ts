import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Vendor } from './entity/vendor.entity';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): Vendor | User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
