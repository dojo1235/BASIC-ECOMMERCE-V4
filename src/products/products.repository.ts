import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  Repository,
  ILike,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  FindOptionsWhere,
} from 'typeorm'
import { Product } from 'src/products/entities/product.entity'
import { paginate } from 'src/common/utils/pagination.util'
import { FindProductsDto } from './dto/find-products.dto'

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findAllProducts(query: FindProductsDto) {
    const where: FindOptionsWhere<Product> = {}
    if (query.search) where.name = ILike(`%${query.search}%`)
    if (query.status) where.status = query.status
    if (query.minPrice && query.maxPrice) {
      where.price = Between(query.minPrice, query.maxPrice)
    } else if (query.minPrice) {
      where.price = MoreThanOrEqual(query.minPrice)
    } else if (query.maxPrice) {
      where.price = LessThanOrEqual(query.maxPrice)
    }
    if ('isDeleted' in query) where.isDeleted = query.isDeleted
    const result = await paginate(this.repository, query, { where })
    return { products: result.items, meta: result.meta }
  }

  async findProductById(productId: number) {
    return await this.repository.findOne({ where: { id: productId } })
  }

  async createProduct(data: Partial<Product>) {
    return await this.repository.save(this.repository.create(data))
  }

  async updateProduct(productId: number, data: Partial<Product>) {
    return await this.repository.update({ id: productId }, data)
  }
}
