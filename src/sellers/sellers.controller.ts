import { Controller, Post, Get, Patch, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { SellersService } from './sellers.service'
import { CreateSellerDto } from './dto/create-seller.dto'
import { UpdateSellerDto } from './dto/update-seller.dto'
import { SellerResponseDto } from './dto/seller-response.dto'

@Auth()
@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  @ApiOperation({ summary: 'Create seller store (user becomes seller)' })
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

  @Get()
  @ApiOperation({ summary: 'Get seller store details' })
  @ApiSuccessResponse({
    description: 'Seller fetched successfully',
    type: SellerResponseDto,
  })
  async findSeller(@CurrentUser() user: CurrentUserPayload): Promise<SellerResponseDto> {
    return await this.sellersService.findSeller(user.id)
  }

  @Patch()
  @ApiOperation({ summary: 'Update seller store details' })
  @ApiSuccessResponse({
    description: 'Seller updated successfully',
    type: SellerResponseDto,
  })
  async updateSeller(
    @Body() updateSellerDto: UpdateSellerDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<SellerResponseDto> {
    return await this.sellersService.updateSeller(user.id, updateSellerDto)
  }
}
