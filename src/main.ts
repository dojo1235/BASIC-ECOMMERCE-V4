import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SanitizeInterceptor } from './common/interceptors/sanitize.interceptor'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.setGlobalPrefix('api')
  // enable global validation/transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // strips properties not in DTOs
      forbidNonWhitelisted: true, // throws if extra props are sent
      transform: true,            // converts payloads to DTO class types
    }),
  )
  // Globally apply sanitation
  app.useGlobalInterceptors(new SanitizeInterceptor())
  // plug in global exception filter
  app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()