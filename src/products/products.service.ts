import { Injectable } from '@nestjs/common'
import { ProductsRepository } from './products.repository'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}
  // Create product (admin)
  async createProduct(data, adminId) {
    const created = await this.productsRepository.createProduct({
      ...data,
      createdBy: adminId,
    })
    return { product: created }
  }

  // Find all products (admin)
  async findAllProductsForAdmin(query) {
    return await this.productsRepository.findAllProducts(query)
  }

  // Find all products (user)
  async findAllProducts(query) {
    query.isDeleted = false
    return await this.productsRepository.findAllProducts(query)
  }

  // Find one product (admin)
  async findOneProductForAdmin(productId) {
    const product = await this.productsRepository.findProductById(productId)
    if (!product) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    return { product }
  }

  // Find one product (user)
  async findOneProduct(productId) {
    const product = await this.productsRepository.findProductById(productId)
    if (!product || product.isDeleted)
      throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    return { product }
  }

  // Update product (admin)
  async updateProduct(productId, data) {
    const existing = await this.productsRepository.findProductById(productId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    await this.productsRepository.updateProduct(productId, data)
    const updated = await this.productsRepository.findProductById(productId)
    return { product: updated }
  }
}