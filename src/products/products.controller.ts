import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ApiParam, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { ProductsService } from './products.service'
import { FindProductsDto } from './dto/find-products.dto'
import { ProductsListResponseDto } from './dto/products-list-response.dto'
import { ProductResponseDto } from './dto/product-response.dto'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all products' })
  @ApiOkResponse({ description: 'Products fetched successfully', type: ProductsListResponseDto })
  async findAllProducts(@Query() query: FindProductsDto) {
    return {
      data: await this.productsService.findAllProducts(query),
      message: 'Products fetched successfully',
    }
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Fetch a single product' })
  @ApiParam({ name: 'productId', description: 'ID of the product', type: Number })
  @ApiOkResponse({ description: 'Product fetched successfully', type: ProductResponseDto })
  async findOneProduct(@Param('productId', ParseIntPipe) productId: number) {
    return {
      data: await this.productsService.findOneProduct(productId),
      message: 'Product fetched successfully',
    }
  }
}
