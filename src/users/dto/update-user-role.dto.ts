import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEnum } from 'class-validator'
import { AdminRole } from '../entities/user.entity'

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsEnum(AdminRole)
  @ApiProperty({ description: 'New role to assign to the user', enum: AdminRole })
  role: AdminRole
}
