import { Controller, Post, Get, Patch, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UserRole } from 'src/users/entities/user.entity'
import { SellersService } from './sellers.service'
import { CreateBrandDto } from 'src/products/dto/create-brand.dto'
import { UpdateBrandDto } from 'src/products/dto/update-brand.dto'
import { BrandResponseDto } from 'src/products/dto/brand-response.dto'
import { BrandIdParamDto } from 'src/common/dto/brand-id-param.dto'

@Auth(UserRole.Seller)
@Controller('sellers/brands')
export class SellersBrandsController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  @ApiOperation({ summary: 'Create seller brand' })
  @ApiSuccessResponse({
    description: 'Brand created successfully',
    type: BrandResponseDto,
    status: HttpStatus.CREATED,
  })
  async createBrand(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createBrandDto: CreateBrandDto,
  ): Promise<BrandResponseDto> {
    return await this.sellersService.createBrand(user.id, createBrandDto)
  }

  @Get(':brandId')
  @ApiOperation({ summary: 'Find seller brand' })
  @ApiSuccessResponse({ description: 'Brand fetched successfully', type: BrandResponseDto })
  async findBrand(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { brandId }: BrandIdParamDto,
  ): Promise<BrandResponseDto> {
    return await this.sellersService.findSellerBrand(user.id, brandId)
  }

  @Patch(':brandId')
  @ApiOperation({ summary: 'Update seller brand' })
  @ApiSuccessResponse({ description: 'Brand updated successfully', type: BrandResponseDto })
  async updateBrand(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { brandId }: BrandIdParamDto,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    return await this.sellersService.updateBrand(user.id, brandId, updateBrandDto)
  }
}
