import { Controller, Post, Patch, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UserRole } from 'src/users/entities/user.entity'
import { SellersService } from './sellers.service'
import { CreateProductImageDto } from 'src/products/dto/create-product-image.dto'
import { UpdateProductImageDto } from 'src/products/dto/update-product-image.dto'
import { ProductImageResponseDto } from 'src/products/dto/product-image-response.dto'
import { ProductIdParamDto } from 'src/common/dto/product-id-param.dto'
import { ProductImageIdParamDto } from 'src/common/dto/product-image-id-param.dto'

@Auth(UserRole.Seller)
@Controller('sellers/product-images')
export class SellersProductsImagesController {
  constructor(private readonly sellersService: SellersService) {}

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
    return await this.sellersService.createProductImage(user.id, productId, createProductImageDto)
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
    return await this.sellersService.updateProductImage(
      user.id,
      productImageId,
      updateProductImageDto,
    )
  }
}
