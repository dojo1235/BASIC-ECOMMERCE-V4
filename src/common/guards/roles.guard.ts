import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AdminRole, UserRole, Role } from 'src/users/entities/user.entity'
import { AppError, ErrorCode } from '../exceptions/app-error'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>('roles', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRole) return true

    const request = context.switchToHttp().getRequest<{ user: { role: Role } }>()
    const user = request.user
    if (!user) throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'User not authenticated')

    if (user.role === AdminRole.SuperAdmin) return true

    const allowedRoles = this.RoleHierarchy[user.role] ?? []

    if (!allowedRoles.includes(requiredRole)) {
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Access denied!! Route forbidden')
    }

    return true
  }

  private readonly RoleHierarchy: Record<Exclude<Role, AdminRole.SuperAdmin>, Role[]> = {
    [AdminRole.GeneralAdmin]: [
      AdminRole.GeneralAdmin,
      AdminRole.ProductManager,
      AdminRole.OrderManager,
      AdminRole.PaymentManager,
      AdminRole.UserManager,
      AdminRole.SellerManager,
      AdminRole.ViewOnlyAdmin,
    ],
    [AdminRole.ProductManager]: [AdminRole.ProductManager, AdminRole.ViewOnlyAdmin],
    [AdminRole.OrderManager]: [AdminRole.OrderManager, AdminRole.ViewOnlyAdmin],
    [AdminRole.PaymentManager]: [AdminRole.PaymentManager, AdminRole.ViewOnlyAdmin],
    [AdminRole.UserManager]: [AdminRole.UserManager, AdminRole.ViewOnlyAdmin],
    [AdminRole.SellerManager]: [AdminRole.SellerManager, AdminRole.ViewOnlyAdmin],
    [AdminRole.ViewOnlyAdmin]: [AdminRole.ViewOnlyAdmin],
    [UserRole.Seller]: [UserRole.Seller],
    [UserRole.User]: [],
  }
}
