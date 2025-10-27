import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { ProductsService } from './products.service'
import { FindProductsDto } from './dto/find-products.dto'
import { ProductsListResponseDto } from './dto/products-list-response.dto'
import { ProductResponseDto } from './dto/product-response.dto'
import { ProductIdParamDto } from '../common/dto/product-id-param.dto'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all products' })
  @ApiSuccessResponse({
    description: 'Products fetched successfully',
    type: ProductsListResponseDto,
  })
  async findAllProducts(@Query() query: FindProductsDto): Promise<ProductsListResponseDto> {
    return await this.productsService.findAllProducts(query)
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Fetch a single product' })
  @ApiSuccessResponse({ description: 'Product fetched successfully', type: ProductResponseDto })
  async findOneProduct(@Param() { productId }: ProductIdParamDto): Promise<ProductResponseDto> {
    return await this.productsService.findOneProduct(productId)
  }
}
