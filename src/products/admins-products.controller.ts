import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
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

@Auth(Role.ProductManager)
@Controller('admins/products')
export class AdminsProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new product' })
  @ApiSuccessResponse({
    description: 'Product created successfully',
    type: ProductResponseDto,
    status: HttpStatus.CREATED,
  })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ProductResponseDto> {
    return await this.productsService.createProduct(createProductDto, user.id)
  }

  @Get()
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch all products' })
  @ApiSuccessResponse({
    description: 'Products fetched successfully',
    type: ProductsListResponseDto,
  })
  async findAllProducts(@Query() query: FindProductsDto): Promise<ProductsListResponseDto> {
    return await this.productsService.findAllProductsForAdmin(query)
  }

  @Get(':productId')
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch a single product' })
  @ApiSuccessResponse({ description: 'Product fetched successfully', type: ProductResponseDto })
  async findOneProduct(@Param() { productId }: ProductIdParamDto): Promise<ProductResponseDto> {
    return await this.productsService.findOneProductForAdmin(productId)
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update product details' })
  @ApiSuccessResponse({ description: 'Product fetched successfully', type: ProductResponseDto })
  async updateProduct(
    @Param() { productId }: ProductIdParamDto,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ProductResponseDto> {
    return await this.productsService.updateProduct(productId, {
      ...updateProductDto,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':productId/status')
  @ApiOperation({ summary: 'Update product status' })
  @ApiSuccessResponse({
    description: 'Product status updated successfully',
    type: ProductResponseDto,
  })
  async updateProductStatus(
    @Param() { productId }: ProductIdParamDto,
    @Body() { status }: UpdateProductStatusDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ProductResponseDto> {
    return await this.productsService.updateProduct(productId, {
      status,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':productId/restore')
  @ApiOperation({ summary: 'Restore soft-deleted product' })
  @ApiSuccessResponse({ description: 'Product restored successfully', type: ProductResponseDto })
  async restoreProduct(
    @Param() { productId }: ProductIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ProductResponseDto> {
    return await this.productsService.updateProduct(productId, {
      isDeleted: false,
      restoredById: user.id,
      restoredAt: new Date(),
    })
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Soft-delete product' })
  @ApiSuccessResponse({ description: 'Product deleted successfully', type: ProductResponseDto })
  async deleteProduct(
    @Param() { productId }: ProductIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ProductResponseDto> {
    return await this.productsService.updateProduct(productId, {
      isDeleted: true,
      deletedById: user.id,
      deletedAt: new Date(),
    })
  }
}
