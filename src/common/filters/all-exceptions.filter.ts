import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>()

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    let message: string

    if (exception instanceof HttpException) {
      const res = exception.getResponse()
      
      // If it's a validation error, extract the detailed messages
      if (typeof res === 'object' && res.hasOwnProperty('message')) {
        if (Array.isArray(res['message'])) {
          // Combine multiple messages into a single string
          message = res['message'].join(', ');
        } else {
          message = res['message']
        }
      } else {
        message = exception.message || 'An error occurred'
      }
    } else {
      message = 'Internal server error'
    }
    
    response.status(status).json({
      success: false,
      message,
      data: null,
      statusCode: status,
    })
  }
}



// For debugging
/*import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === 'object' && res.hasOwnProperty('message')) {
        if (Array.isArray((res as any).message)) {
          message = (res as any).message.join(', ');
        } else {
          message = (res as any).message;
        }
      } else {
        message = exception.message || 'An error occurred';
      }
    } else {
      message = exception?.message || 'Internal server error';
    }

    //  Detailed error log for debugging
    console.error('\n====== ERROR START ======');
    console.error('URL:', request.url);
    console.error('Method:', request.method);
    console.error('Status:', status);
    console.error('Message:', message);
    console.error('Raw Exception:', exception);
    if (exception?.stack) console.error('Stack Trace:\n', exception.stack);
    console.error('====== ERROR END ======\n');

    response.status(status).json({
      success: false,
      message,
      data: null,
      statusCode: status,
    });
  }
}*/