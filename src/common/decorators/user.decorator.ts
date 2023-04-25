// 自定义装饰器

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TIdAndUsername } from 'src/types';
import { Employee } from '../../employee/entities/employee.entity';

export const User = createParamDecorator<
  TIdAndUsername,
  ExecutionContext,
  | Pick<Employee, TIdAndUsername>
  | Pick<Employee, TIdAndUsername>[TIdAndUsername]
>((data, ctx) => {
  const user = ctx.switchToHttp().getRequest<Request>().user;
  if (data && user) {
    return user[data];
  }
  return user;
});
