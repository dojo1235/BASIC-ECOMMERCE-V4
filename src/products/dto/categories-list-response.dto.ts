import { ApiProperty } from '@nestjs/swagger'
import { Category } from '../entities/category.entity'

export class CategoriesListResponseDto {
  @ApiProperty({
    description: 'List of categories',
    type: [Category],
  })
  categories: Category[]
}
