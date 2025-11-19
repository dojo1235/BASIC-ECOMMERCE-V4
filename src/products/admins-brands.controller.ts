import { Controller, Post, Patch, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { AdminRole } from 'src/users/entities/user.entity'
import { ProductsService } from './products.service'
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'
import { BrandResponseDto } from './dto/brand-response.dto'
import { BrandIdParamDto } from 'src/common/dto/brand-id-param.dto'

@Auth(AdminRole.ProductManager)
@Controller('admins/brands')
export class AdminsBrandsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create brand' })
  @ApiSuccessResponse({
    description: 'Brand created successfully',
    type: BrandResponseDto,
    status: HttpStatus.CREATED,
  })
  async createBrand(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createBrandDto: CreateBrandDto,
  ): Promise<BrandResponseDto> {
    return await this.productsService.createBrand(user.id, createBrandDto)
  }

  @Patch(':brandId')
  @ApiOperation({ summary: 'Update brand' })
  @ApiSuccessResponse({
    description: 'Brand updated successfully',
    type: BrandResponseDto,
  })
  async updateBrand(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { brandId }: BrandIdParamDto,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    return await this.productsService.updateBrand(brandId, {
      ...updateBrandDto,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':brandId/activate')
  @ApiOperation({ summary: 'Activate brand' })
  @ApiSuccessResponse({
    description: 'Brand activated successfully',
    type: BrandResponseDto,
  })
  async activateBrand(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { brandId }: BrandIdParamDto,
  ): Promise<BrandResponseDto> {
    return await this.productsService.updateBrand(brandId, {
      isActive: true,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':brandId/deactivate')
  @ApiOperation({ summary: 'De-activate brand' })
  @ApiSuccessResponse({
    description: 'Brand deactivated successfully',
    type: BrandResponseDto,
  })
  async deActivateBrand(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { brandId }: BrandIdParamDto,
  ): Promise<BrandResponseDto> {
    return await this.productsService.updateBrand(brandId, {
      isActive: false,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':brandId/restrict')
  @ApiOperation({ summary: 'Restrict brand' })
  @ApiSuccessResponse({
    description: 'Brand restricted successfully',
    type: BrandResponseDto,
  })
  async restrictBrand(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { brandId }: BrandIdParamDto,
  ): Promise<BrandResponseDto> {
    return await this.productsService.updateBrand(brandId, {
      isRestricted: true,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':brandId/unrestrict')
  @ApiOperation({ summary: 'Remove brand restriction' })
  @ApiSuccessResponse({
    description: 'Brand restriction removed successfully',
    type: BrandResponseDto,
  })
  async unRestrictBrand(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { brandId }: BrandIdParamDto,
  ): Promise<BrandResponseDto> {
    return await this.productsService.updateBrand(brandId, {
      isRestricted: false,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }
}
