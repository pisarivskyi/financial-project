import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// TODO: legacy, could be removed in future
export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  return request.user;
});
