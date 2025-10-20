import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  Repository,
  EntityManager,
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

  async findAllProducts(query: FindProductsDto, manager?: EntityManager) {
    const repo = this.repo(manager)
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
    const result = await paginate(repo, query, { where })
    return { products: result.items, meta: result.meta }
  }

  async findProductById(productId: number, manager?: EntityManager) {
    const repo = this.repo(manager)
    return await repo.findOne({ where: { id: productId } })
  }

  async createProduct(data: Partial<Product>, manager?: EntityManager) {
    const repo = this.repo(manager)
    return await repo.save(repo.create(data))
  }

  async updateProduct(productId: number, data: Partial<Product>, manager?: EntityManager) {
    const repo = this.repo(manager)
    return await repo.update({ id: productId }, data)
  }

  private repo(manager?: EntityManager) {
    return manager ? manager.getRepository(Product) : this.repository
  }
}
