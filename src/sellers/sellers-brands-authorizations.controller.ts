import { Controller, Post, Get, Param, Body, Query, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UserRole } from 'src/users/entities/user.entity'
import { SellersService } from './sellers.service'
import { CreateBrandAuthorizationDto } from './dto/create-brand-authorization.dto'
import { FindBrandAuthorizationsDto } from './dto/find-brand-authorizations.dto'
import { BrandAuthorizationsListResponseDto } from './dto/brand-authorizations-list-response.dto'
import { BrandAuthorizationResponseDto } from './dto/brand-authorization-response.dto'
import { BrandAuthorizationIdParamDto } from 'src/common/dto/brand-authorization-id-param.dto'

@Auth(UserRole.Seller)
@Controller('sellers/brand-authorizations')
export class SellersBrandsAuthorizationsController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  @ApiOperation({ summary: 'Request brand authorization' })
  @ApiSuccessResponse({
    description: 'Brand authorization request created successfully',
    type: BrandAuthorizationResponseDto,
    status: HttpStatus.CREATED,
  })
  async createBrandAuthorization(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createBrandAuthorizationDto: CreateBrandAuthorizationDto,
  ): Promise<BrandAuthorizationResponseDto> {
    return await this.sellersService.createBrandAuthorization(user.id, createBrandAuthorizationDto)
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all seller brand authorizations request' })
  @ApiSuccessResponse({
    description: 'Brand authorizations fetched successfully',
    type: BrandAuthorizationsListResponseDto,
  })
  async findMyBrandAuthorizations(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: FindBrandAuthorizationsDto,
  ): Promise<BrandAuthorizationsListResponseDto> {
    return await this.sellersService.findSellerBrandAuthorizations(user.id, query)
  }

  @Get(':brandAuthorizationId')
  @ApiOperation({ summary: 'Fetch seller brand authorization by ID' })
  @ApiSuccessResponse({
    description: 'Brand authorization fetched successfully',
    type: BrandAuthorizationResponseDto,
  })
  async findMyBrandAuthorization(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { brandAuthorizationId }: BrandAuthorizationIdParamDto,
  ): Promise<BrandAuthorizationResponseDto> {
    return await this.sellersService.findSellerBrandAuthorizationById(user.id, brandAuthorizationId)
  }
}
