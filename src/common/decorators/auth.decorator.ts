import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Roles } from './roles.decorator'
import { Role } from 'src/common/enums/roles.enum'

export const Auth = (role?: Role) =>
  applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    ...(role ? [Roles(role)] : []), // apply Roles only if role is provided
  )