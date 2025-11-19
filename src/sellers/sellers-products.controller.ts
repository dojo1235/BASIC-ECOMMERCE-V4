import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UserRole } from 'src/users/entities/user.entity'
import { SellersService } from './sellers.service'
import { CreateProductDto } from 'src/products/dto/create-product.dto'
import { UpdateProductDto } from 'src/products/dto/update-product.dto'
import { FindProductsDto } from 'src/products/dto/find-products.dto'
import { ProductsListResponseDto } from 'src/products/dto/products-list-response.dto'
import { ProductResponseDto } from 'src/products/dto/product-response.dto'
import { ProductIdParamDto } from 'src/common/dto/product-id-param.dto'

@Auth(UserRole.Seller)
@Controller('sellers/products')
export class SellersProductsController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product for seller' })
  @ApiSuccessResponse({
    description: 'Product created successfully',
    type: ProductResponseDto,
    status: HttpStatus.CREATED,
  })
  async createProduct(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.sellersService.createProduct(user.id, createProductDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all products of a seller' })
  @ApiSuccessResponse({
    description: 'Products fetched successfully',
    type: ProductsListResponseDto,
  })
  async getSellerProducts(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: FindProductsDto,
  ): Promise<ProductsListResponseDto> {
    return await this.sellersService.findAllProducts(user.id, query)
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get a specific product of a seller' })
  @ApiSuccessResponse({
    description: 'Product fetched successfully',
    type: ProductResponseDto,
  })
  async getSellerProductById(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { productId }: ProductIdParamDto,
  ): Promise<ProductResponseDto> {
    return await this.sellersService.findOneProduct(user.id, productId)
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update a product for seller' })
  @ApiSuccessResponse({
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  async updateSellerProduct(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { productId }: ProductIdParamDto,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.sellersService.updateProduct(user.id, productId, updateProductDto)
  }

  @Patch(':productId/restore')
  @ApiOperation({ summary: 'Restore soft-deleted product for seller' })
  @ApiSuccessResponse({ description: 'Product restored successfully', type: ProductResponseDto })
  async restoreProduct(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { productId }: ProductIdParamDto,
  ): Promise<ProductResponseDto> {
    return await this.sellersService.updateProduct(user.id, productId, {
      isDeleted: false,
      restoredById: user.id,
      restoredAt: new Date(),
    })
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Soft-delete product for seller' })
  @ApiSuccessResponse({ description: 'Product deleted successfully', type: ProductResponseDto })
  async deleteProduct(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { productId }: ProductIdParamDto,
  ): Promise<ProductResponseDto> {
    return await this.sellersService.updateProduct(user.id, productId, {
      isDeleted: true,
      deletedById: user.id,
      deletedAt: new Date(),
    })
  }
}
