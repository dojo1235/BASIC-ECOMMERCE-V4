import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ApiParam, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { FindProductsDto } from './dto/find-products.dto'
import { UpdateProductStatusDto } from './dto/update-product-status.dto'
import { ProductsListResponseDto } from './dto/products-list-response.dto'
import { ProductResponseDto } from './dto/product-response.dto'
import { Role } from 'src/users/entities/user.entity'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'

@ApiBearerAuth()
@Controller('admins/products')
export class AdminsProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post() // Create new product
  @Auth(Role.ProductManager)
  @ApiCreatedResponse({ description: 'Product created successfully', type: ProductResponseDto })
  async createProduct(@Body() createProductDto: CreateProductDto, @CurrentUser() user) {
    return {
      data: await this.productsService.createProduct(createProductDto, user.id),
      message: 'Product created successfully',
    }
  }

  @Get() // Fetch all products
  @Auth(Role.ViewOnlyAdmin)
  @ApiOkResponse({ description: 'Products fetched successfully', type: ProductsListResponseDto })
  async findAll(@Query() query: FindProductsDto) {
    return {
      data: await this.productsService.findAllProductsForAdmin(query),
      message: 'Products fetched successfully',
    }
  }

  @Get(':productId') // Fetch a single product
  @Auth(Role.ViewOnlyAdmin)
  @ApiParam({ name: 'productId', description: 'ID of the product', type: Number })
  @ApiOkResponse({ description: 'Product fetched successfully', type: ProductResponseDto })
  async findOne(@Param('productId', ParseIntPipe) productId: number) {
    return {
      data: await this.productsService.findOneProductForAdmin(productId),
      message: 'Product fetched successfully',
    }
  }

  @Patch(':productId') // Update product
  @Auth(Role.ProductManager)
  @ApiParam({ name: 'productId', type: Number })
  @ApiOkResponse({ description: 'Product updated successfully', type: ProductResponseDto })
  async update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user,
  ) {
    return {
      data: await this.productsService.updateProduct(productId, {
        ...updateProductDto,
        updatedBy: user.id,
        updatedAt: new Date(),
      }),
      message: 'Product updated successfully',
    }
  }

  @Patch(':productId/status') // Update product status
  @Auth(Role.ProductManager)
  @ApiParam({ name: 'productId', type: Number })
  @ApiOkResponse({ description: 'Product status updated successfully', type: ProductResponseDto })
  async updateStatus(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() { status }: UpdateProductStatusDto,
    @CurrentUser() user
  ) {
    return {
      data: await this.productsService.updateProduct(productId, {
        status,
        updatedBy: user.id,
        updatedAt: new Date(),
      }),
      message: 'Product status updated successfully',
    }
  }

  @Patch(':productId/restore') // Restore product
  @Auth(Role.ProductManager)
  @ApiParam({ name: 'productId', type: Number })
  @ApiOkResponse({ description: 'Product restored successfully', type: ProductResponseDto })
  async restore(@Param('productId', ParseIntPipe) productId: number, @CurrentUser() user) {
    return {
      data: await this.productsService.updateProduct(productId, {
        isDeleted: false,
        restoredBy: user.id,
        restoredAt: new Date(),
      }),
      message: 'Product restored successfully',
    }
  }

  @Delete(':productId') // Soft-delete product
  @Auth(Role.SuperAdmin)
  @ApiParam({ name: 'productId', type: Number })
  @ApiOkResponse({ description: 'Product deleted successfully', type: ProductResponseDto })
  async remove(@Param('productId', ParseIntPipe) productId: number, @CurrentUser() user) {
    return {
      data: await this.productsService.updateProduct(productId, {
        isDeleted: true,
        deletedBy: user.id,
        deletedAt: new Date(),
      }),
      message: 'Product deleted successfully',
    }
  }
}