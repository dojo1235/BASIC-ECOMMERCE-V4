import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { Throttle } from  '@nestjs/throttler'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register user
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return buildResponse(
      await this.authService.register(registerDto),
      'Registration successful',
    )
  }

  // Login user
  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return buildResponse(
      await this.authService.login(loginDto),
      'Login successful',
    )
  }

  // Refresh token
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return buildResponse(
      await this.authService.refreshToken(body.refreshToken),
      'Token refreshed successfully',
    )
  }

  // Logout
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    return buildResponse(
      await this.authService.logout(body.refreshToken),
      'Logout successful',
    )
  }
  
  // Logout from all devices
  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  async logoutAll(@Body() body: { refreshToken: string }) {
    return buildResponse(
      await this.authService.logoutAll(body.refreshToken),
      'Logged out from all devices successfully',
    )
  }
}