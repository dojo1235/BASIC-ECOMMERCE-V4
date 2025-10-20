import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Role } from 'src/users/entities/user.entity'

export class UserResponseDto {
  @ApiProperty({ description: 'Unique identifier of the user' })
  id!: number

  @ApiProperty({ description: 'Full name of the user' })
  name!: string

  @ApiProperty({ description: 'Email address of the user' })
  email!: string

  @ApiPropertyOptional({ description: 'Role assigned to the user', enum: Role })
  role?: Role

  @ApiPropertyOptional({ description: 'Indicates if the user is currently banned' })
  isBanned?: boolean

  @ApiPropertyOptional({ description: 'Indicates if the user has been soft-deleted' })
  isDeleted?: boolean

  @ApiPropertyOptional({ description: 'ID of the user who created this record', nullable: true })
  createdById?: number

  @ApiPropertyOptional({ description: 'Date and time when the user was created' })
  createdAt?: Date

  @ApiPropertyOptional({
    description: 'ID of the user who last updated this record',
    nullable: true,
  })
  updatedById?: number

  @ApiPropertyOptional({
    description: 'Date and time when the user was last updated',
    nullable: true,
  })
  updatedAt?: Date

  @ApiPropertyOptional({ description: 'ID of the user who deleted this record', nullable: true })
  deletedById?: number

  @ApiPropertyOptional({ description: 'Date and time when the user was deleted', nullable: true })
  deletedAt?: Date

  @ApiPropertyOptional({ description: 'ID of the user who restored this record', nullable: true })
  restoredById?: number

  @ApiPropertyOptional({ description: 'Date and time when the user was restored', nullable: true })
  restoredAt?: Date
}
