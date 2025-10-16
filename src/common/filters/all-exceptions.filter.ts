import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { AppError } from '../exceptions/app-error'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'

    if (exception instanceof AppError) {
      status = exception.toHttpCode()
      message = exception.message
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const response = exception.getResponse()
      message =
        typeof response === 'string'
          ? response
          : (response as any)?.message || exception.message
    } else if (exception instanceof Error) {
      message = exception.message
    }

    const responseBody = {
      success: false,
      message,
      data: null,
      statusCode: status,
      path: request?.url,
      timestamp: new Date().toISOString(),
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status)
  }
}