import { Controller, Get, Patch, Param, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { AdminRole } from 'src/users/entities/user.entity'
import { SellersService } from './sellers.service'
import { FindBrandAuthorizationsDto } from './dto/find-brand-authorizations.dto'
import { BrandAuthorizationsListResponseDto } from './dto/brand-authorizations-list-response.dto'
import { BrandAuthorizationResponseDto } from './dto/brand-authorization-response.dto'
import { BrandAuthorizationIdParamDto } from 'src/common/dto/brand-authorization-id-param.dto'

@Auth(AdminRole.SellerManager)
@Controller('admins/sellers/brand-authorizations')
export class AdminsSellersBrandsAuthorizationsController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all brand authorizations request' })
  @ApiSuccessResponse({
    description: 'Brand authorizations fetched successfully',
    type: BrandAuthorizationsListResponseDto,
  })
  async findAllBrandAuthorizations(
    @Query() query: FindBrandAuthorizationsDto,
  ): Promise<BrandAuthorizationsListResponseDto> {
    return await this.sellersService.findAllBrandAuthorizations(query)
  }

  @Get(':brandAuthorizationId')
  @ApiOperation({ summary: 'Fetch brand authorization request by ID' })
  @ApiSuccessResponse({
    description: 'Brand authorization fetched successfully',
    type: BrandAuthorizationResponseDto,
  })
  async findBrandAuthorization(
    @Param() { brandAuthorizationId }: BrandAuthorizationIdParamDto,
  ): Promise<BrandAuthorizationResponseDto> {
    return await this.sellersService.findBrandAuthorizationById(brandAuthorizationId)
  }

  @Patch(':brandAuthorizationId/authorize')
  @ApiOperation({ summary: 'Authorize brand authorization request' })
  @ApiSuccessResponse({
    description: 'Brand authorization request authorized successfully',
    type: BrandAuthorizationResponseDto,
  })
  async authorizeBrandAuthorization(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { brandAuthorizationId }: BrandAuthorizationIdParamDto,
  ): Promise<BrandAuthorizationResponseDto> {
    return await this.sellersService.updateBrandAuthorization(brandAuthorizationId, {
      isAuthorized: true,
      authorizedById: user.id,
      authorizedAt: new Date(),
    })
  }

  @Patch(':brandAuthorizationId/unauthorize')
  @ApiOperation({ summary: 'Un-authorize brand authorization permission' })
  @ApiSuccessResponse({
    description: 'Brand authorization permission revoked successfully',
    type: BrandAuthorizationResponseDto,
  })
  async unAuthorizeBrandAuthorization(
    @CurrentUser() user: CurrentUserPayload,
    @Param() { brandAuthorizationId }: BrandAuthorizationIdParamDto,
  ): Promise<BrandAuthorizationResponseDto> {
    return await this.sellersService.updateBrandAuthorization(brandAuthorizationId, {
      isAuthorized: false,
      unAuthorizedById: user.id,
      unAuthorizedAt: new Date(),
    })
  }
}
