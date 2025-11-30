import { Controller, Post, Patch, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { AdminRole } from 'src/users/entities/user.entity'
import { ProductsService } from './products.service'
import { CreateProductImageDto } from './dto/create-product-image.dto'
import { UpdateProductImageDto } from './dto/update-product-image.dto'
import { ProductImageResponseDto } from './dto/product-image-response.dto'
import { ProductIdParamDto } from 'src/common/dto/product-id-param.dto'
import { ProductImageIdParamDto } from 'src/common/dto/product-image-id-param.dto'

@Auth(AdminRole.ProductManager)
@Controller('admins/product-images')
export class AdminsProductsImagesController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('products/:productId')
  @ApiOperation({ summary: 'Create product image' })
  @ApiSuccessResponse({
    description: 'Product image created successfully',
    type: ProductImageResponseDto,
    status: HttpStatus.CREATED,
  })
  async createProductImage(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { productId }: ProductIdParamDto,
    @Body() createProductImageDto: CreateProductImageDto,
  ): Promise<ProductImageResponseDto> {
    return await this.productsService.createProductImage(user.id, productId, createProductImageDto)
  }

  @Patch(':productImageId')
  @ApiOperation({ summary: 'Update product image' })
  @ApiSuccessResponse({
    description: 'Product image updated successfully',
    type: ProductImageResponseDto,
  })
  async updateProductImage(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { productImageId }: ProductImageIdParamDto,
    @Body() updateProductImageDto: UpdateProductImageDto,
  ): Promise<ProductImageResponseDto> {
    return await this.productsService.updateProductImage(productImageId, {
      ...updateProductImageDto,
      updatedById: user.id,
    })
  }
}
