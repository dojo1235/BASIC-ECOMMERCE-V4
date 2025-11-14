import { Injectable } from '@nestjs/common'
import { Transactional } from 'typeorm-transactional'
import { SellersRepository } from './sellers.repository'
import { ProductsRepository } from 'src/products/products.repository'
import { UsersRepository } from 'src/users/users.repository'
import { Seller, PremiumTier } from './entities/seller.entity'
import { Product, ProductPriority } from 'src/products/entities/product.entity'
import { FindSellersDto } from './dto/find-sellers.dto'
import { FindProductsDto } from 'src/products/dto/find-products.dto'
import { Role } from 'src/users/entities/user.entity'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'

@Injectable()
export class SellersService {
  constructor(
    private readonly sellersRepository: SellersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  // Create seller store(user)
  @Transactional()
  async createSeller(userId: number, data: Partial<Seller>) {
    const existing = await this.sellersRepository.findSellerByUserId(userId)
    if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Seller already exist')
    const created = await this.sellersRepository.createSeller({
      ...data,
      userId,
    })
    await this.usersRepository.updateUser(userId, { role: Role.Seller })
    return { seller: created }
  }

  // Find all sellers (admin)
  async findAllSellers(query: FindSellersDto) {
    return await this.sellersRepository.findAllSellers(query)
  }

  // Find single seller by seller ID(admin)
  async findSellerForAdmin(sellerId: number) {
    const seller = await this.sellersRepository.findSellerById(sellerId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    return { seller }
  }

  // Find single seller by seller ID(user)
  async findSellerById(userId: number, sellerId: number) {
    const seller = await this.ensureIsOwner(userId, sellerId)
    return { seller }
  }

  // Find single seller by User ID (both)
  async findSellerByUserId(userId: number) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    return { seller }
  }

  // Update sellers details (admin)
  async updateSellerForAdmin(sellerId: number, data: Partial<Seller>) {
    const existing = await this.sellersRepository.findSellerById(sellerId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    await this.sellersRepository.updateSeller(sellerId, data)
    const updated = await this.sellersRepository.findSellerById(sellerId)
    return { seller: updated }
  }

  // Update sellers tier (admin)
  @Transactional()
  async updateSellerTier(adminId: number, sellerId: number, { premiumTier }: Partial<Seller>) {
    const existing = await this.sellersRepository.findSellerById(sellerId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    await this.sellersRepository.updateSeller(sellerId, { premiumTier })
    let priority = 0
    if (premiumTier === PremiumTier.Silver) priority = ProductPriority.Low
    if (premiumTier === PremiumTier.Gold) priority = ProductPriority.Medium
    if (premiumTier === PremiumTier.Diamond) priority = ProductPriority.High
    await this.productsRepository.updateSellerProducts(sellerId, {
      priority,
      updatedById: adminId,
    })
    const updated = await this.sellersRepository.findSellerById(sellerId)
    return { seller: updated }
  }

  // Update seller details (user)
  async updateSeller(userId: number, sellerId: number, data: Partial<Seller>) {
    await this.ensureIsOwner(userId, sellerId)
    await this.sellersRepository.updateSeller(sellerId, data)
    const updated = await this.sellersRepository.findSellerById(sellerId)
    return { seller: updated }
  }

  // Create seller product (user)
  async createProduct(userId: number, sellerId: number, data: Partial<Product>) {
    const seller = await this.ensureIsOwner(userId, sellerId)
    let priority = 0
    if (seller.premiumTier === PremiumTier.Silver) priority = ProductPriority.Low
    if (seller.premiumTier === PremiumTier.Gold) priority = ProductPriority.Medium
    if (seller.premiumTier === PremiumTier.Diamond) priority = ProductPriority.High
    const created = await this.productsRepository.createProduct({
      sellerId,
      ...data,
      priority,
      createdById: userId,
    })
    return { product: created }
  }

  // Find seller products (user)
  async findAllProducts(userId: number, sellerId: number, query: FindProductsDto) {
    await this.ensureIsOwner(userId, sellerId)
    query.sellerId = sellerId
    query.isDeleted = false
    return await this.productsRepository.findAllProducts(query)
  }

  // Find one product for seller (user)
  async findOneProduct(userId: number, sellerId: number, productId: number) {
    await this.ensureIsOwner(userId, sellerId)
    const product = await this.productsRepository.findProductById(productId)
    if (!product || product.sellerId !== sellerId)
      throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    return { product }
  }

  // Update product (user)
  async updateProduct(userId: number, sellerId: number, productId: number, data: Partial<Product>) {
    await this.ensureIsOwner(userId, sellerId)
    const existing = await this.productsRepository.findProductById(productId)
    if (!existing || existing.sellerId !== sellerId)
      throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    await this.productsRepository.updateProduct(productId, data)
    const updated = await this.productsRepository.findProductById(productId)
    return { product: updated }
  }

  private async ensureIsOwner(userId: number, sellerId: number) {
    const existing = await this.sellersRepository.findSellerById(sellerId)
    if (!existing || existing.userId !== userId) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Not a seller')
    }
    return existing
  }
}
