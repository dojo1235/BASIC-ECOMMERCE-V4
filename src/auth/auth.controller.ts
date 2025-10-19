import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { RegisterResponseDto } from './dto/register-response.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // Register user
  @ApiCreatedResponse({ description: 'Registration successful', type: RegisterResponseDto })
  async register(@Body() registerDto: RegisterDto) {
    return {
      data: await this.authService.register(registerDto),
      message: 'Registration successful',
    }
  }

  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @HttpCode(HttpStatus.OK) // Login user
  @Post('login')
  @ApiOkResponse({ description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return {
      data: await this.authService.login(loginDto),
      message: 'Login successful',
    }
  }

  @HttpCode(HttpStatus.OK) // Refresh token
  @Post('refresh')
  @ApiOkResponse({ description: 'Token refreshed successfully' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return {
      data: await this.authService.refreshToken(refreshTokenDto.refreshToken),
      message: 'Token refreshed successfully',
    }
  }

  @HttpCode(HttpStatus.OK) // Logout
  @Post('logout')
  @ApiOkResponse({ description: 'Logout successful' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return {
      data: await this.authService.logout(refreshTokenDto.refreshToken),
      message: 'Logout successful',
    }
  }

  @HttpCode(HttpStatus.OK) // Logout from all
  @Post('logout-all')
  @ApiOkResponse({ description: 'Logout from all devices' })
  async logoutAll(@Body() refreshTokenDto: RefreshTokenDto) {
    return {
      data: await this.authService.logoutAll(refreshTokenDto.refreshToken),
      message: 'Logged out from all devices successfully',
    }
  }
}
