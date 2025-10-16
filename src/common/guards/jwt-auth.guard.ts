import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { AppError, ErrorCode } from '../exceptions/app-error'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const accessToken = this.extractTokenFromHeader(request)
    if (!accessToken) throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Authentication required')

    try {
      const { accessSecret } = this.config.get('jwt')
      const payload = await this.jwtService.verifyAsync(accessToken, { secret: accessSecret })
      request.user = { id: payload.sub, role: payload.role }
    } catch {
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Invalid token')
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}