import { HttpException, HttpStatus } from '@nestjs/common'

export class AppError extends HttpException {
  constructor(message: string, statusCode = HttpStatus.BAD_REQUEST) {
    super({
      success: false,
      message,
      data: null,
      statusCode
    }, statusCode)
  }
}