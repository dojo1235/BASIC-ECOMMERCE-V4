import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { verifyAccessToken } from 'src/common/utils/jwt.util'
import { AppError } from 'src/common/errors/app-error'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Missing or invalid Authorization header', HttpStatus.UNAUTHORIZED)
    }
    const token = authHeader.split(' ')[1]
    try {
      const decoded = verifyAccessToken(token)
      request.user = { id: decoded.id, role: decoded.role }
      return true
    } catch (err) {
      throw new AppError('Invalid or expired token', HttpStatus.UNAUTHORIZED)
    }
  }
}