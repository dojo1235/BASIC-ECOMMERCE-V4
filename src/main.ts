import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
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
  
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  // plug in global exception filter
  app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()