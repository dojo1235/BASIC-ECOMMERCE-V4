import { Controller, Post, Get, Patch, Delete, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UsersService } from './users.service'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'
import { AddressesListResponseDto } from './dto/addresses-list-response.dto'
import { AddressResponseDto } from './dto/address-response.dto'
import { AddressIdParamDto } from 'src/common/dto/address-id-param.dto'

@Auth()
@Controller('addresses')
export class AddressesController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiSuccessResponse({
    description: 'Address created successfully',
    type: AddressResponseDto,
    status: HttpStatus.CREATED,
  })
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<AddressResponseDto> {
    return await this.usersService.createAddress({ ...createAddressDto, userId: user.id })
  }

  @Get()
  @ApiOperation({ summary: 'Get all user addresses' })
  @ApiSuccessResponse({
    description: 'Addresses fetched successfully',
    type: AddressesListResponseDto,
  })
  async getAddresses(@CurrentUser() user: CurrentUserPayload): Promise<AddressesListResponseDto> {
    return await this.usersService.findAddresses(user.id)
  }

  @Get(':addressId')
  @ApiOperation({ summary: 'Get a specific address' })
  @ApiSuccessResponse({
    description: 'Address fetched successfully',
    type: AddressResponseDto,
  })
  async getAddressById(
    @Param() { addressId }: AddressIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<AddressResponseDto> {
    return await this.usersService.findAddressById(addressId, user.id)
  }

  @Patch(':addressId')
  @ApiOperation({ summary: 'Update an address' })
  @ApiSuccessResponse({
    description: 'Address updated successfully',
    type: AddressResponseDto,
  })
  async updateAddress(
    @Param() { addressId }: AddressIdParamDto,
    @Body() updateAddressDto: UpdateAddressDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<AddressResponseDto> {
    return await this.usersService.updateAddress(addressId, user.id, updateAddressDto)
  }

  @Delete(':addressId')
  @ApiOperation({ summary: 'Delete an address' })
  @ApiSuccessResponse({
    description: 'Address deleted successfully',
  })
  async deleteAddress(
    @Param() { addressId }: AddressIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    await this.usersService.deleteAddress(addressId, user.id)
  }
}
