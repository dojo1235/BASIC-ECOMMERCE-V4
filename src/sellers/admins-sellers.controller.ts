import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { SellersService } from './sellers.service'
import { Role } from 'src/users/entities/user.entity'
import { FindSellersDto } from './dto/find-sellers.dto'
import { SellerResponseDto } from './dto/seller-response.dto'
import { SellersListResponseDto } from './dto/sellers-list-response.dto'
import { UpdateSellerTierDto } from './dto/update-seller-tier.dto'
import { SellerIdParamDto } from 'src/common/dto/seller-id-param.dto'
import { UserIdParamDto } from 'src/common/dto/user-id-param.dto'

@Auth(Role.SellerManager)
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
  @ApiOperation({ summary: 'Get seller by user ID (cleck if seller exist)' })
  @ApiSuccessResponse({
    description: 'Seller fetched successfully',
    type: SellerResponseDto,
  })
  async findSellerByUserId(@Param() { userId }: UserIdParamDto): Promise<SellerResponseDto> {
    return await this.sellersService.findSellerByUserId(userId)
  }

  @Patch(':sellerId')
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

  @Patch(':sellerId/suspended')
  @ApiOperation({ summary: 'Suspend seller account' })
  @ApiSuccessResponse({ description: 'Seller suspended successfully', type: SellerResponseDto })
  async suspendSeller(
    @Param() { sellerId }: SellerIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SellerResponseDto> {
    return await this.sellersService.updateSellerForAdmin(sellerId, {
      isSuspended: true,
      suspendedById: user.id,
      suspendedAt: new Date(),
    })
  }

  @Patch(':sellerId/restore')
  @ApiOperation({ summary: 'Restore seller account' })
  @ApiSuccessResponse({ description: 'Seller restored successfully', type: SellerResponseDto })
  async restoreSeller(
    @Param() { sellerId }: SellerIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SellerResponseDto> {
    return await this.sellersService.updateSellerForAdmin(sellerId, {
      isSuspended: false,
      restoredById: user.id,
      restoredAt: new Date(),
    })
  }
}
