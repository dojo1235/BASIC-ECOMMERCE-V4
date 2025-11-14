import { Controller, Post, Get, Patch, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { ProductsService } from './products.service'
import { CreateProductImageDto } from './dto/create-product-image.dto'
import { UpdateProductImageDto } from './dto/update-product-image.dto'
import { ProductImageResponseDto } from './dto/product-image-response.dto'
import { ProductImagesListResponseDto } from './dto/product-images-list-response.dto'
import { ProductIdParamDto } from 'src/common/dto/product-id-param.dto'
import { ProductImageIdParamDto } from 'src/common/dto/product-image-id-param.dto'
import { Role } from 'src/users/entities/user.entity'

@Controller('product-images')
export class ProductsImagesController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('products/:productId')
  @Auth(Role.ProductManager)
  @ApiOperation({ summary: 'Create product image (admin)' })
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

  @Get('products/:productId')
  @Auth()
  @ApiOperation({ summary: 'Get all images for a product' })
  @ApiSuccessResponse({
    description: 'Product images fetched successfully',
    type: ProductImagesListResponseDto,
  })
  async findProductImages(
    @Param() { productId }: ProductIdParamDto,
  ): Promise<ProductImagesListResponseDto> {
    return await this.productsService.findProductImages(productId)
  }

  @Get(':productImageId')
  @Auth()
  @ApiOperation({ summary: 'Get a single product image' })
  @ApiSuccessResponse({
    description: 'Product image fetched successfully',
    type: ProductImageResponseDto,
  })
  async findOneProductImage(
    @Param() { productImageId }: ProductImageIdParamDto,
  ): Promise<ProductImageResponseDto> {
    return await this.productsService.findOneProductImage(productImageId)
  }

  @Patch(':productImageId')
  @Auth(Role.ProductManager)
  @ApiOperation({ summary: 'Update product image (admin)' })
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
