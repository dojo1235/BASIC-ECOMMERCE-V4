import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query, Req } from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductStatus } from 'src/common/enums/product-status.enum'
import { Role } from 'src/common/enums/roles.enum'
import { Auth } from 'src/common/decorators/auth.decorator'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('admins/products')
export class AdminsProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  // Create new product
  @Post()
  @Auth(Role.ProductManager)
  async createProduct(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    return buildResponse(
      await this.productsService.createProduct(createProductDto, req.user.id),
      'Product created successfully',
    )
  }

  // Fetch all products
  @Get()
  @Auth(Role.ViewOnlyAdmin)
  async findAll(@Query() query: Record<string, any>) {
    return buildResponse(
      await this.productsService.findAllProductsForAdmin(query),
      'Products fetched successfully',
    )
  }

  // Fetch a single product
  @Get(':id')
  @Auth(Role.ViewOnlyAdmin)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return buildResponse(
      await this.productsService.findOneProductForAdmin(id),
      'Product fetched successfully',
    )
  }

  // Update product
  @Patch(':id')
  @Auth(Role.ProductManager)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ) {
    return buildResponse(
      await this.productsService.updateProduct(id, {
        ...dto,
        updatedBy: req.user.id,
        updatedAt: new Date(),
      }),
      'Product updated successfully',
    )
  }

  // Update product status
  @Patch(':id/status')
  @Auth(Role.ProductManager)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: ProductStatus,
    @Req() req: any,
  ) {
    return buildResponse(
      await this.productsService.updateProduct(id, {
        status,
        updatedBy: req.user.id,
        updatedAt: new Date(),
      }),
      'Product status updated successfully',
    )
  }

  // Restore product
  @Patch(':id/restore')
  @Auth(Role.ProductManager)
  async restore(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return buildResponse(
      await this.productsService.updateProduct(id, {
        isDeleted: false,
        restoredBy: req.user.id,
        restoredAt: new Date(),
      }),
      'Product restored successfully',
    )
  }

  // Soft-delete product
  @Delete(':id')
  @Auth(Role.SuperAdmin)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return buildResponse(
      await this.productsService.updateProduct(id, {
        isDeleted: true,
        deletedBy: req.user.id,
        deletedAt: new Date(),
      }),
      'Product deleted successfully',
    )
  }
}