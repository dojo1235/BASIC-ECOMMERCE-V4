import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { ProductsService } from './products.service'
import { CategoriesListResponseDto } from './dto/categories-list-response.dto'
import { CategoryResponseDto } from './dto/category-response.dto'
import { CategoryIdParamDto } from 'src/common/dto/category-id-param.dto'

@Auth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('tree')
  @ApiOperation({ summary: 'Get full categories tree' })
  @ApiSuccessResponse({
    description: 'Categories fetched successfully',
    type: CategoriesListResponseDto,
  })
  async findCategoriesTree(): Promise<CategoriesListResponseDto> {
    return await this.productsService.findCategoriesTree()
  }

  @Get(':categoryId')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiSuccessResponse({
    description: 'Category fetched successfully',
    type: CategoryResponseDto,
  })
  async findOneCategory(@Param() { categoryId }: CategoryIdParamDto): Promise<CategoryResponseDto> {
    return await this.productsService.findOneCategory(categoryId)
  }
}
