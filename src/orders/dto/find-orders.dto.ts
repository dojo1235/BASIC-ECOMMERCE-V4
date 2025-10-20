import { IsEnum, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { OrderStatus } from '../entities/order.entity'
import { QueryBoolean } from 'src/common/decorators/query-boolean.decorator'
import { SortOrder } from 'src/common/enums/sort-order.enum'

export class FindOrdersDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiPropertyOptional({ description: 'Filter by status', enum: OrderStatus })
  status?: OrderStatus

  @IsOptional()
  @QueryBoolean()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Include deleted orders' })
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
  @IsEnum(SortOrder)
  @ApiPropertyOptional({ description: 'Sort order', enum: SortOrder })
  orderBy?: SortOrder
}
