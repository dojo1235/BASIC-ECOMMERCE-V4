import { Controller, Post, Get, Patch, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { SellersService } from './sellers.service'
import { Role } from 'src/users/entities/user.entity'
import { CreateSellerDto } from './dto/create-seller.dto'
import { UpdateSellerDto } from './dto/update-seller.dto'
import { SellerResponseDto } from './dto/seller-response.dto'
import { SellerIdParamDto } from 'src/common/dto/seller-id-param.dto'

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  @Auth()
  @ApiOperation({ summary: 'Create seller profile (user becomes seller)' })
  @ApiSuccessResponse({
    description: 'Seller created successfully',
    type: SellerResponseDto,
    status: HttpStatus.CREATED,
  })
  async createSeller(
    @Body() createSellerDto: CreateSellerDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SellerResponseDto> {
    return await this.sellersService.createSeller(user.id, createSellerDto)
  }

  @Get(':sellerId')
  @Auth(Role.Seller)
  @ApiOperation({ summary: 'Get seller by seller ID' })
  @ApiSuccessResponse({
    description: 'Seller fetched successfully',
    type: SellerResponseDto,
  })
  async findSellerById(
    @Param() { sellerId }: SellerIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SellerResponseDto> {
    return await this.sellersService.findSellerById(user.id, sellerId)
  }

  @Get('users')
  @Auth()
  @ApiOperation({ summary: 'Get seller by user ID (cleck if seller exist)' })
  @ApiSuccessResponse({
    description: 'Seller fetched successfully',
    type: SellerResponseDto,
  })
  async findSellerByUserId(@CurrentUser() user: CurrentUserPayload): Promise<SellerResponseDto> {
    return await this.sellersService.findSellerByUserId(user.id)
  }

  @Patch(':sellerId')
  @Auth(Role.Seller)
  @ApiOperation({ summary: 'Update seller details' })
  @ApiSuccessResponse({
    description: 'Seller updated successfully',
    type: SellerResponseDto,
  })
  async updateSeller(
    @Param() { sellerId }: SellerIdParamDto,
    @Body() updateSellerDto: UpdateSellerDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SellerResponseDto> {
    return await this.sellersService.updateSeller(user.id, sellerId, {
      ...updateSellerDto,
    })
  }
}
