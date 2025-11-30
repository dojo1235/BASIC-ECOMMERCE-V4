import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { AdminRole } from 'src/users/entities/user.entity'
import { SellersService } from './sellers.service'
import { UpdateSellerTierDto } from './dto/update-seller-tier.dto'
import { FindSellersDto } from './dto/find-sellers.dto'
import { SellersListResponseDto } from './dto/sellers-list-response.dto'
import { SellerResponseDto } from './dto/seller-response.dto'
import { SellerIdParamDto } from 'src/common/dto/seller-id-param.dto'
import { UserIdParamDto } from 'src/common/dto/user-id-param.dto'

@Auth(AdminRole.SellerManager)
@Controller('admins/sellers')
export class AdminsSellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sellers' })
  @ApiSuccessResponse({
    description: 'Sellers fetched successfully',
    type: SellersListResponseDto,
  })
  async findAllSellers(@Query() query: FindSellersDto): Promise<SellersListResponseDto> {
    return await this.sellersService.findAllSellers(query)
  }

  @Get(':sellerId')
  @ApiOperation({ summary: 'Get seller by seller ID' })
  @ApiSuccessResponse({
    description: 'Seller fetched successfully',
    type: SellerResponseDto,
  })
  async findSellerById(@Param() { sellerId }: SellerIdParamDto): Promise<SellerResponseDto> {
    return await this.sellersService.findSellerForAdmin(sellerId)
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get seller by user ID' })
  @ApiSuccessResponse({
    description: 'Seller fetched successfully',
    type: SellerResponseDto,
  })
  async findSellerByUserId(@Param() { userId }: UserIdParamDto): Promise<SellerResponseDto> {
    return await this.sellersService.findSeller(userId)
  }

  @Patch(':sellerId/tier')
  @ApiOperation({ summary: 'Update seller tier' })
  @ApiSuccessResponse({
    description: 'Seller tier updated successfully',
    type: SellerResponseDto,
  })
  async updateSellerTier(
    @Param() { sellerId }: SellerIdParamDto,
    @Body() updateSellerTierDto: UpdateSellerTierDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SellerResponseDto> {
    return await this.sellersService.updateSellerTier(user.id, sellerId, updateSellerTierDto)
  }

  @Patch(':sellerId/verify')
  @ApiOperation({ summary: 'Verify seller store' })
  @ApiSuccessResponse({ description: 'Seller verified successfully', type: SellerResponseDto })
  async verifySeller(
    @Param() { sellerId }: SellerIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SellerResponseDto> {
    return await this.sellersService.verifySeller(user.id, sellerId)
  }

  @Patch(':sellerId/unverify')
  @ApiOperation({ summary: 'Un-verify seller store' })
  @ApiSuccessResponse({
    description: 'Seller verification removed successfully',
    type: SellerResponseDto,
  })
  async unVerifySeller(
    @Param() { sellerId }: SellerIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SellerResponseDto> {
    return await this.sellersService.unVerifySeller(user.id, sellerId)
  }

  @Patch(':sellerId/suspended')
  @ApiOperation({ summary: 'Suspend seller store' })
  @ApiSuccessResponse({ description: 'Seller suspended successfully', type: SellerResponseDto })
  async suspendSeller(
    @Param() { sellerId }: SellerIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SellerResponseDto> {
    return await this.sellersService.suspendSeller(user.id, sellerId)
  }

  @Patch(':sellerId/restore')
  @ApiOperation({ summary: 'Restore seller store' })
  @ApiSuccessResponse({ description: 'Seller restored successfully', type: SellerResponseDto })
  async restoreSeller(
    @Param() { sellerId }: SellerIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SellerResponseDto> {
    return await this.sellersService.restoreSeller(user.id, sellerId)
  }
}
