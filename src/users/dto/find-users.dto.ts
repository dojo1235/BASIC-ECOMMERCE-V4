import { IsEnum, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Role } from '../entities/user.entity'

export class FindUsersDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search term for user name' })
  search?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by email address' })
  email?: string

  @IsOptional()
  @IsEnum(Role)
  @ApiPropertyOptional({ description: 'Filter by role', enum: Role })
  role?: Role

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : value === 'true'))
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Filter by banned status (true or false)' })
  isBanned?: boolean

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : value === 'true'))
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Filter by deleted status (true or false)' })
  isDeleted?: boolean

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: 'Page number for pagination' })
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: 'Page size for pagination' })
  limit?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Sort order direction', enum: ['asc', 'desc'] })
  orderBy?: 'asc' | 'desc'
}