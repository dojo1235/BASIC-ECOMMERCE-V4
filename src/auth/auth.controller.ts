import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { AuthResponseDto } from './dto/auth-response.dto'
import { TokensResponseDto } from './dto/tokens-response.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiSuccessResponse({
    description: 'Registration successful',
    type: AuthResponseDto,
    status: HttpStatus.CREATED,
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authService.register(registerDto)
  }

  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiSuccessResponse({ description: 'Login successful', type: AuthResponseDto })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(loginDto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiSuccessResponse({ description: 'Token refreshed successfully', type: TokensResponseDto })
  async refresh(@Body() { refreshToken }: RefreshTokenDto): Promise<TokensResponseDto> {
    return await this.authService.refreshToken(refreshToken)
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiSuccessResponse({ description: 'Logout successful' })
  async logout(@Body() { refreshToken }: RefreshTokenDto): Promise<void> {
    return await this.authService.logout(refreshToken)
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiSuccessResponse({ description: 'Logout from all devices' })
  async logoutAll(@Body() { refreshToken }: RefreshTokenDto): Promise<void> {
    return await this.authService.logoutAll(refreshToken)
  }
}
