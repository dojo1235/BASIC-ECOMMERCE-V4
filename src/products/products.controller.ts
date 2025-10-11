import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ProductsService } from './products.service'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Fetch all products
  @Get()
  async findAll(@Query() query: Record<string, any>) {
    return buildResponse(
      await this.productsService.findAllProductsForUser(query),
      'Products fetched successfully',
    )
  }

  // Fetch a single product
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return buildResponse(
      await this.productsService.findOneProductForUser(id),
      'Product fetched successfully',
    )
  }
}