import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RolesGuard } from '../guards/roles.guard'
import { Role } from 'src/users/entities/user.entity'

/**
 * Roles decorator (internal use)
 */
const Roles = (role: Role) => SetMetadata('roles', role)

/**
 * Auth decorator
 * - Applies JWT and Roles guards
 * - Optionally enforces a specific role
 */
export const Auth = (role?: Role) =>
  applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    ...(role ? [Roles(role)] : []),
  )