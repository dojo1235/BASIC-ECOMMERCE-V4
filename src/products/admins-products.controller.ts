import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiOkResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { FindProductsDto } from './dto/find-products.dto'
import { UpdateProductStatusDto } from './dto/update-product-status.dto'
import { ProductsListResponseDto } from './dto/products-list-response.dto'
import { ProductResponseDto } from './dto/product-response.dto'
import { Role } from 'src/users/entities/user.entity'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { ProductIdParamDto } from '../common/dto/product-id-param.dto'
import { plainToInstance } from 'class-transformer'

@Controller('admins/products')
export class AdminsProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(Role.ProductManager)
  @ApiOperation({ summary: 'Create new product' })
  @ApiCreatedResponse({ description: 'Product created successfully', type: ProductResponseDto })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(ProductResponseDto, {
      data: await this.productsService.createProduct(createProductDto, user.id),
      message: 'Product created successfully',
    })
  }

  @Get()
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch all products' })
  @ApiOkResponse({ description: 'Products fetched successfully', type: ProductsListResponseDto })
  async findAll(@Query() query: FindProductsDto) {
    return plainToInstance(ProductsListResponseDto, {
      data: await this.productsService.findAllProductsForAdmin(query),
      message: 'Products fetched successfully',
    })
  }

  @Get(':productId')
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch a single product' })
  @ApiOkResponse({ description: 'Product fetched successfully', type: ProductResponseDto })
  async findOne(@Param() { productId }: ProductIdParamDto) {
    return plainToInstance(ProductResponseDto, {
      data: await this.productsService.findOneProductForAdmin(productId),
      message: 'Product fetched successfully',
    })
  }

  @Patch(':productId')
  @Auth(Role.ProductManager)
  @ApiOperation({ summary: 'Update product details' })
  @ApiOkResponse({ description: 'Product updated successfully', type: ProductResponseDto })
  async update(
    @Param() { productId }: ProductIdParamDto,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(ProductResponseDto, {
      data: await this.productsService.updateProduct(productId, {
        ...updateProductDto,
        updatedById: user.id,
        updatedAt: new Date(),
      }),
      message: 'Product updated successfully',
    })
  }

  @Patch(':productId/status')
  @Auth(Role.ProductManager)
  @ApiOperation({ summary: 'Update product status' })
  @ApiOkResponse({ description: 'Product status updated successfully', type: ProductResponseDto })
  async updateStatus(
    @Param() { productId }: ProductIdParamDto,
    @Body() { status }: UpdateProductStatusDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(ProductResponseDto, {
      data: await this.productsService.updateProduct(productId, {
        status,
        updatedById: user.id,
        updatedAt: new Date(),
      }),
      message: 'Product status updated successfully',
    })
  }

  @Patch(':productId/restore')
  @Auth(Role.ProductManager)
  @ApiOperation({ summary: 'Restore product' })
  @ApiOkResponse({ description: 'Product restored successfully', type: ProductResponseDto })
  async restore(
    @Param() { productId }: ProductIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(ProductResponseDto, {
      data: await this.productsService.updateProduct(productId, {
        isDeleted: false,
        restoredById: user.id,
        restoredAt: new Date(),
      }),
      message: 'Product restored successfully',
    })
  }

  @Delete(':productId')
  @Auth(Role.SuperAdmin)
  @ApiOperation({ summary: 'Soft-delete product' })
  @ApiOkResponse({ description: 'Product deleted successfully', type: ProductResponseDto })
  async remove(@Param() { productId }: ProductIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(ProductResponseDto, {
      data: await this.productsService.updateProduct(productId, {
        isDeleted: true,
        deletedById: user.id,
        deletedAt: new Date(),
      }),
      message: 'Product deleted successfully',
    })
  }
}
