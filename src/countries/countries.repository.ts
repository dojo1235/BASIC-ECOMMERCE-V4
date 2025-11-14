import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Country } from './entities/country.entity'

@Injectable()
export class CountriesRepository {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async createCountry(data: Partial<Country>) {
    const entity = this.countryRepository.create(data)
    return await this.countryRepository.save(entity)
  }

  async findAllCountries() {
    return await this.countryRepository.find()
  }

  async findCountryById(countryId: number) {
    return await this.countryRepository.findOne({ where: { id: countryId } })
  }

  async updateCountry(countryId: number, data: Partial<Country>) {
    return await this.countryRepository.update({ id: countryId }, data)
  }
}
