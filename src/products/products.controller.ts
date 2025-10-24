import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { ProductsService } from './products.service'
import { FindProductsDto } from './dto/find-products.dto'
import { ProductsListResponseDto } from './dto/products-list-response.dto'
import { ProductResponseDto } from './dto/product-response.dto'
import { ProductIdParamDto } from '../common/dto/product-id-param.dto'
import { plainToInstance } from 'class-transformer'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all products' })
  @ApiOkResponse({ description: 'Products fetched successfully', type: ProductsListResponseDto })
  async findAllProducts(@Query() query: FindProductsDto) {
    return plainToInstance(ProductsListResponseDto, {
      data: await this.productsService.findAllProducts(query),
      message: 'Products fetched successfully',
    })
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Fetch a single product' })
  @ApiOkResponse({ description: 'Product fetched successfully', type: ProductResponseDto })
  async findOneProduct(@Param() { productId }: ProductIdParamDto) {
    return plainToInstance(ProductResponseDto, {
      data: await this.productsService.findOneProduct(productId),
      message: 'Product fetched successfully',
    })
  }
}
