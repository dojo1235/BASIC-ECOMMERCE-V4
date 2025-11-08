import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export type CurrentUserPayload = {
  id: number
  role: string
}

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()

  return req.user
})
