import { Controller, Post, Get, Patch, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { Role } from 'src/users/entities/user.entity'
import { ProductsService } from './products.service'
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'
import { FindBrandsDto } from './dto/find-brands.dto'
import { BrandResponseDto } from './dto/brand-response.dto'
import { BrandsListResponseDto } from './dto/brands-list-response.dto'
import { BrandIdParamDto } from 'src/common/dto/brand-id-param.dto'

@Controller('brands')
export class BrandsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(Role.ProductManager)
  @ApiOperation({ summary: 'Create brand (admin)' })
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

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiSuccessResponse({ description: 'Brands fetched successfully', type: BrandsListResponseDto })
  async findAllBrands(@Body() query: FindBrandsDto): Promise<BrandsListResponseDto> {
    return await this.productsService.findAllBrands(query)
  }

  @Get(':brandId')
  @Auth()
  @ApiOperation({ summary: 'Get brand by ID' })
  @ApiSuccessResponse({ description: 'Brand fetched successfully', type: BrandResponseDto })
  async findOneBrand(@Param() { brandId }: BrandIdParamDto): Promise<BrandResponseDto> {
    return await this.productsService.findOneBrand(brandId)
  }

  @Patch(':brandId')
  @Auth(Role.ProductManager)
  @ApiOperation({ summary: 'Update brand (admin)' })
  @ApiSuccessResponse({ description: 'Brand updated successfully', type: BrandResponseDto })
  async updateBrand(
    @Param() { brandId }: BrandIdParamDto,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    return await this.productsService.updateBrand(brandId, updateBrandDto)
  }
}
