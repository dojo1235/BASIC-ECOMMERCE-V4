import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { ProductsService } from './products.service'
import { ProductImagesListResponseDto } from './dto/product-images-list-response.dto'
import { ProductImageResponseDto } from './dto/product-image-response.dto'
import { ProductIdParamDto } from 'src/common/dto/product-id-param.dto'
import { ProductImageIdParamDto } from 'src/common/dto/product-image-id-param.dto'

@Controller('product-images')
export class ProductsImagesController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products/:productId')
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
}
