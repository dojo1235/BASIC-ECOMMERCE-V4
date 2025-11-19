import { Controller, Post, Patch, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { AdminRole } from 'src/users/entities/user.entity'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { ProductsService } from './products.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoryResponseDto } from './dto/category-response.dto'
import { CategoryIdParamDto } from 'src/common/dto/category-id-param.dto'

@Auth(AdminRole.ProductManager)
@Controller('admins/categories')
export class AdminsCategoriesController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create category' })
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

  @Patch(':categoryId')
  @ApiOperation({ summary: 'Update category' })
  @ApiSuccessResponse({
    description: 'Category updated successfully',
    type: CategoryResponseDto,
  })
  async updateCategory(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { categoryId }: CategoryIdParamDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return await this.productsService.updateCategory(categoryId, {
      ...updateCategoryDto,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':categoryId/activate')
  @ApiOperation({ summary: 'Activate category' })
  @ApiSuccessResponse({
    description: 'Category activated successfully',
    type: CategoryResponseDto,
  })
  async activateCategory(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { categoryId }: CategoryIdParamDto,
  ): Promise<CategoryResponseDto> {
    return await this.productsService.updateCategory(categoryId, {
      isActive: true,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':categoryId/deactivate')
  @ApiOperation({ summary: 'De-activate category' })
  @ApiSuccessResponse({
    description: 'Category deactivated successfully',
    type: CategoryResponseDto,
  })
  async deActivateCategory(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { categoryId }: CategoryIdParamDto,
  ): Promise<CategoryResponseDto> {
    return await this.productsService.updateCategory(categoryId, {
      isActive: false,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }
}
