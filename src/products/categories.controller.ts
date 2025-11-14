import { Controller, Post, Get, Patch, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { Role } from 'src/users/entities/user.entity'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { ProductsService } from './products.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoryResponseDto } from './dto/category-response.dto'
import { CategoriesListResponseDto } from './dto/categories-list-response.dto'
import { CategoryIdParamDto } from 'src/common/dto/category-id-param.dto'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(Role.ProductManager)
  @ApiOperation({ summary: 'Create category (admin)' })
  @ApiSuccessResponse({
    description: 'Category created successfully',
    type: CategoryResponseDto,
    status: HttpStatus.CREATED,
  })
  async createCategory(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return await this.productsService.createCategory(user.id, createCategoryDto)
  }

  @Get('tree')
  @Auth()
  @ApiOperation({ summary: 'Get full categories tree' })
  @ApiSuccessResponse({
    description: 'Categories fetched successfully',
    type: CategoriesListResponseDto,
  })
  async findCategoriesTree(): Promise<CategoriesListResponseDto> {
    return await this.productsService.findCategoriesTree()
  }

  @Get(':categoryId')
  @Auth()
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiSuccessResponse({ description: 'Category fetched successfully', type: CategoryResponseDto })
  async findOneCategory(@Param() { categoryId }: CategoryIdParamDto): Promise<CategoryResponseDto> {
    return await this.productsService.findOneCategory(categoryId)
  }

  @Patch(':categoryId')
  @Auth(Role.ProductManager)
  @ApiOperation({ summary: 'Update category (admin)' })
  @ApiSuccessResponse({ description: 'Category updated successfully', type: CategoryResponseDto })
  async updateCategory(
    @Param() { categoryId }: CategoryIdParamDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return await this.productsService.updateCategory(categoryId, updateCategoryDto)
  }
}
