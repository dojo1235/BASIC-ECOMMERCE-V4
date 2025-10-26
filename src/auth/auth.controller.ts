import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { AuthResponseDto } from './dto/auth-response.dto'
import { TokensResponseDto } from './dto/tokens-response.dto'
import { plainToInstance } from 'class-transformer'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiCreatedResponse({ description: 'Registration successful', type: AuthResponseDto })
  async register(@Body() registerDto: RegisterDto) {
    return plainToInstance(AuthResponseDto, {
      data: await this.authService.register(registerDto),
      message: 'Registration successful',
    })
  }

  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ description: 'Login successful', type: AuthResponseDto })
  async login(@Body() loginDto: LoginDto) {
    return plainToInstance(AuthResponseDto, {
      data: await this.authService.login(loginDto),
      message: 'Login successful',
    })
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiOkResponse({ description: 'Token refreshed successfully', type: TokensResponseDto })
  async refresh(@Body() { refreshToken }: RefreshTokenDto) {
    return plainToInstance(TokensResponseDto, {
      data: await this.authService.refreshToken(refreshToken),
      message: 'Token refreshed successfully',
    })
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiOkResponse({ description: 'Logout successful', type: TokensResponseDto })
  async logout(@Body() { refreshToken }: RefreshTokenDto) {
    return plainToInstance(TokensResponseDto, {
      data: await this.authService.logout(refreshToken),
      message: 'Logout successful',
    })
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiOkResponse({ description: 'Logout from all devices', type: TokensResponseDto })
  async logoutAll(@Body() { refreshToken }: RefreshTokenDto) {
    return plainToInstance(TokensResponseDto, {
      data: await this.authService.logoutAll(refreshToken),
      message: 'Logged out from all devices successfully',
    })
  }
}
