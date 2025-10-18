import { createParamDecorator, ExecutionContext } from '@nestjs/common'

type CurrentUserPayload = {
  id: number
  role: string
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const req = ctx.switchToHttp().getRequest()
    return req.user as CurrentUserPayload
  },
)
