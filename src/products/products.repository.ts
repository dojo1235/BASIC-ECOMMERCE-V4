import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  Repository,
  TreeRepository,
  ILike,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  FindOptionsWhere,
} from 'typeorm'
import { Product } from './entities/product.entity'
import { ProductImage } from './entities/product-image.entity'
import { Brand } from './entities/brand.entity'
import { Category } from './entities/category.entity'
import { paginate } from 'src/common/utils/pagination.util'
import { FindProductsDto } from './dto/find-products.dto'
import { FindBrandsDto } from './dto/find-brands.dto'

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
  ) {}

  async createProduct(data: Partial<Product>) {
    const entity = this.productRepository.create(data)
    return await this.productRepository.save(entity)
  }

  async findAllProducts(query: FindProductsDto) {
    const where: FindOptionsWhere<Product> = {}
    if (query.search) where.name = ILike(`%${query.search}%`)
    if (query.sellerId) where.sellerId = query.sellerId
    if (query.brandName) where.brandName = query.brandName
    if (query.status) where.status = query.status
    if (query.minPrice && query.maxPrice) {
      where.price = Between(query.minPrice, query.maxPrice)
    } else if (query.minPrice) {
      where.price = MoreThanOrEqual(query.minPrice)
    } else if (query.maxPrice) {
      where.price = LessThanOrEqual(query.maxPrice)
    }
    if ('isDeleted' in query) where.isDeleted = query.isDeleted
    const relations = ['productImages']
    const result = await paginate(this.productRepository, query, { where, relations })
    return { products: result.items, meta: result.meta }
  }

  async findProductById(productId: number) {
    return await this.productRepository.findOne({ where: { id: productId } })
  }

  async updateProduct(productId: number, data: Partial<Product>) {
    return await this.productRepository.update({ id: productId }, data)
  }

  async updateSellerProducts(sellerId: number, data: Partial<Product>) {
    return await this.productRepository.update({ sellerId }, data)
  }

  async createProductImage(data: Partial<ProductImage>) {
    const entity = this.productImageRepository.create(data)
    return await this.productImageRepository.save(entity)
  }

  async findProductImages(productId: number) {
    return await this.productImageRepository.find({ where: { productId } })
  }

  async findProductImageById(productImageId: number) {
    return await this.productImageRepository.findOne({ where: { id: productImageId } })
  }

  async clearPrimaryImage(productId: number) {
    return await this.productImageRepository.update({ productId }, { isPrimary: false })
  }

  async updateProductImage(productImageId: number, data: Partial<ProductImage>) {
    return await this.productImageRepository.update({ id: productImageId }, data)
  }

  async createBrand(data: Partial<Brand>) {
    const entity = this.brandRepository.create(data)
    return await this.brandRepository.save(entity)
  }

  async findAllBrands(query: FindBrandsDto) {
    const where: FindOptionsWhere<Brand> = {}
    if (query.search) where.name = ILike(`%${query.search}%`)
    if ('isActive' in query) where.isActive = query.isActive
    if ('isRestricted' in query) where.isRestricted = query.isRestricted
    const result = await paginate(this.brandRepository, query, { where })
    return { brands: result.items, meta: result.meta }
  }

  async findBrandById(brandId: number) {
    return await this.brandRepository.findOne({ where: { id: brandId } })
  }

  async findBrandByName(brandName: string) {
    return await this.brandRepository.findOne({ where: { name: brandName } })
  }

  async updateBrand(brandId: number, data: Partial<Brand>) {
    return await this.brandRepository.update({ id: brandId }, data)
  }

  async createCategory(data: Partial<Category>) {
    const entity = this.categoryRepository.create(data)
    return await this.categoryRepository.save(entity)
  }

  async findCategoriesTree() {
    return await this.categoryRepository.findTrees()
  }

  async findCategoryById(categoryId: number) {
    return await this.categoryRepository.findOne({ where: { id: categoryId } })
  }

  async updateCategory(categoryId: number, data: Partial<Category>) {
    return await this.categoryRepository.update({ id: categoryId }, data)
  }
}
