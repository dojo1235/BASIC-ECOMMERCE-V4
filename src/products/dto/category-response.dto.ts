import { ApiProperty } from '@nestjs/swagger'
import { Category } from '../entities/category.entity'

export class CategoryResponseDto {
  @ApiProperty({ description: 'Category details', type: () => Category, nullable: true })
  category: Category | null
}
