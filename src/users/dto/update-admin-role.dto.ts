import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEnum } from 'class-validator'
import { AdminRole, UserRole } from '../entities/user.entity'

export type AdminAssignableRole = AdminRole | UserRole.User
export const AdminAssignableRole = { ...AdminRole, User: UserRole.User }

export class UpdateAdminRoleDto {
  @IsNotEmpty()
  @IsEnum(AdminAssignableRole)
  @ApiProperty({ description: 'New role to assign to the user', enum: AdminAssignableRole })
  role: AdminAssignableRole
}
