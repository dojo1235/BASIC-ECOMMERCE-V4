import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AppError } from 'src/common/errors/app-error'
import { Role, RoleHierarchy } from 'src/common/enums/roles.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>('roles', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRole) return true
    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user) {
      throw new AppError('User not authenticated', HttpStatus.UNAUTHORIZED)
    }
    if (user.role === Role.SuperAdmin) return true
    const allowedRoles = RoleHierarchy[user.role as Role] || []
    if (!allowedRoles.includes(requiredRole)) {
      throw new AppError('Forbidden: insufficient role', HttpStatus.FORBIDDEN)
    }
    return true
  }
}