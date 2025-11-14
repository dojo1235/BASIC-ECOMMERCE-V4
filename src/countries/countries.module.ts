import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CountriesRepository } from './countries.repository'
import { CountriesService } from './countries.service'
import { CountriesController } from './countries.controller'
import { Country } from './entities/country.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountriesController],
  providers: [CountriesRepository, CountriesService],
  exports: [CountriesRepository],
})
export class CountriesModule {}
