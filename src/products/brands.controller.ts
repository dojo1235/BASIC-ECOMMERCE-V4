import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { ProductsService } from './products.service'
import { FindBrandsDto } from './dto/find-brands.dto'
import { BrandsListResponseDto } from './dto/brands-list-response.dto'
import { BrandResponseDto } from './dto/brand-response.dto'
import { BrandIdParamDto } from 'src/common/dto/brand-id-param.dto'

@Auth()
@Controller('brands')
export class BrandsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiSuccessResponse({
    description: 'Brands fetched successfully',
    type: BrandsListResponseDto,
  })
  async findAllBrands(@Query() query: FindBrandsDto): Promise<BrandsListResponseDto> {
    return await this.productsService.findAllBrands(query)
  }

  @Get(':brandId')
  @ApiOperation({ summary: 'Get brand by ID' })
  @ApiSuccessResponse({
    description: 'Brand fetched successfully',
    type: BrandResponseDto,
  })
  async findOneBrand(@Param() { brandId }: BrandIdParamDto): Promise<BrandResponseDto> {
    return await this.productsService.findOneBrand(brandId)
  }
}
