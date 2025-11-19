import { IsEnum, IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole } from '../entities/user.entity'
import { QueryBoolean } from 'src/common/decorators/query-boolean.decorator'
import { SortOrder } from 'src/common/enums/sort-order.enum'

export class FindUsersDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search term for user email' })
  search?: string

  @IsOptional()
  @IsEnum(UserRole)
  @ApiPropertyOptional({ description: 'Filter by role', enum: UserRole })
  role?: UserRole

  @IsOptional()
  @QueryBoolean()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Filter by banned status (true or false)' })
  isBanned?: boolean

  @IsOptional()
  @QueryBoolean()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Filter by deleted status (true or false)' })
  isDeleted?: boolean

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Page number for pagination' })
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Page size for pagination' })
  limit?: number

  @IsOptional()
  @IsEnum(SortOrder)
  @ApiPropertyOptional({ description: 'Sort order', enum: SortOrder })
  orderBy?: SortOrder
}
