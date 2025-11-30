import { Injectable } from '@nestjs/common'
import { Transactional } from 'typeorm-transactional'
import { SellersRepository } from './sellers.repository'
import { ProductsRepository } from 'src/products/products.repository'
import { CountriesRepository } from 'src/countries/countries.repository'
import { UsersRepository } from 'src/users/users.repository'
import { CreateSellerDto } from './dto/create-seller.dto'
import { CreateProductDto } from 'src/products/dto/create-product.dto'
import { CreateProductImageDto } from 'src/products/dto/create-product-image.dto'
import { CreateBrandDto } from 'src/products/dto/create-brand.dto'
import { CreateBrandAuthorizationDto } from './dto/create-brand-authorization.dto'
import { FindProductsDto } from 'src/products/dto/find-products.dto'
import { FindSellersDto } from './dto/find-sellers.dto'
import { FindBrandAuthorizationsDto } from './dto/find-brand-authorizations.dto'
import { Seller, PremiumTier } from './entities/seller.entity'
import { Product, ProductPriority } from 'src/products/entities/product.entity'
import { ProductImage } from 'src/products/entities/product-image.entity'
import { Brand } from 'src/products/entities/brand.entity'
import { BrandAuthorization } from 'src/products/entities/brand-authorization.entity'
import { UserRole } from 'src/users/entities/user.entity'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'

@Injectable()
export class SellersService {
  constructor(
    private readonly sellersRepository: SellersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly countriesRepository: CountriesRepository,
  ) {}

  // Create seller store(user)
  @Transactional()
  async createSeller(userId: number, data: CreateSellerDto) {
    const existing = await this.sellersRepository.findSellerByUserId(userId)
    if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Seller already exist')
    const country = await this.countriesRepository.findCountryById(data.storeCountryId)
    if (!country) throw new AppError(ErrorCode.NOT_FOUND, 'Country not found')
    const created = await this.sellersRepository.createSeller({
      ...data,
      userId,
    })
    await this.usersRepository.updateUser(userId, { role: UserRole.Seller })
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

  // Find single seller by User ID (both)
  async findSeller(userId: number) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    return { seller }
  }

  // Update seller details (user)
  async updateSeller(userId: number, data: Partial<Seller>) {
    const existing = await this.sellersRepository.findSellerByUserId(userId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    if (data.storeCountryId) {
      const country = await this.countriesRepository.findCountryById(data.storeCountryId)
      if (!country) throw new AppError(ErrorCode.NOT_FOUND, 'Country not found')
    }
    await this.sellersRepository.updateSeller(existing.id, data)
    const updated = await this.sellersRepository.findSellerById(existing.id)
    return { seller: updated }
  }

  // Update seller tier (admin)
  @Transactional()
  async updateSellerTier(adminId: number, sellerId: number, { premiumTier }: Partial<Seller>) {
    const existing = await this.sellersRepository.findSellerById(sellerId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    await this.sellersRepository.updateSeller(sellerId, {
      premiumTier,
      updatedById: adminId,
      updatedAt: new Date(),
    })
    let priority = 0
    if (premiumTier === PremiumTier.Silver) priority = ProductPriority.Low
    if (premiumTier === PremiumTier.Gold) priority = ProductPriority.Medium
    if (premiumTier === PremiumTier.Diamond) priority = ProductPriority.High
    await this.productsRepository.updateSellerProducts(sellerId, {
      priority,
      updatedById: adminId,
      updatedAt: new Date(),
    })
    const updated = await this.sellersRepository.findSellerById(sellerId)
    return { seller: updated }
  }

  // Verify seller (admin)
  @Transactional()
  async verifySeller(adminId: number, sellerId: number) {
    const existing = await this.sellersRepository.findSellerById(sellerId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    await this.sellersRepository.updateSeller(sellerId, {
      isVerified: true,
      updatedById: adminId,
      updatedAt: new Date(),
    })
    await this.productsRepository.updateSellerProducts(sellerId, {
      isSellerVerified: true,
      updatedById: adminId,
      updatedAt: new Date(),
    })
    const updated = await this.sellersRepository.findSellerById(sellerId)
    return { seller: updated }
  }

  // Unverify seller (admin)
  @Transactional()
  async unVerifySeller(adminId: number, sellerId: number) {
    const existing = await this.sellersRepository.findSellerById(sellerId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    await this.sellersRepository.updateSeller(sellerId, {
      isVerified: false,
      updatedById: adminId,
      updatedAt: new Date(),
    })
    await this.productsRepository.updateSellerProducts(sellerId, {
      isSellerVerified: false,
      updatedById: adminId,
      updatedAt: new Date(),
    })
    const updated = await this.sellersRepository.findSellerById(sellerId)
    return { seller: updated }
  }

  // Suspend seller (admin)
  @Transactional()
  async suspendSeller(adminId: number, sellerId: number) {
    const existing = await this.sellersRepository.findSellerById(sellerId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    await this.sellersRepository.updateSeller(sellerId, {
      isSuspended: true,
      suspendedById: adminId,
      suspendedAt: new Date(),
    })
    await this.productsRepository.updateSellerProducts(sellerId, {
      isDeleted: true,
      deletedById: adminId,
      deletedAt: new Date(),
    })
    const updated = await this.sellersRepository.findSellerById(sellerId)
    return { seller: updated }
  }

  // Restore suspended seller (admin)
  @Transactional()
  async restoreSeller(adminId: number, sellerId: number) {
    const existing = await this.sellersRepository.findSellerById(sellerId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    await this.sellersRepository.updateSeller(sellerId, {
      isSuspended: false,
      restoredById: adminId,
      restoredAt: new Date(),
    })
    await this.productsRepository.updateSellerProducts(sellerId, {
      isDeleted: false,
      restoredById: adminId,
      restoredAt: new Date(),
    })
    const updated = await this.sellersRepository.findSellerById(sellerId)
    return { seller: updated }
  }

  // Create seller brand (user)
  async createBrand(userId: number, data: CreateBrandDto) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    const sellerHasBrand = await this.productsRepository.findBrandBySellerId(seller.id)
    if (sellerHasBrand) throw new AppError(ErrorCode.INVALID_STATE, 'Seller already have a brand')
    const existingBrandName = await this.productsRepository.findBrandByName(data.name)
    if (existingBrandName) throw new AppError(ErrorCode.INVALID_STATE, 'Brand name already exists')
    const created = await this.productsRepository.createBrand({
      sellerId: seller.id,
      ...data,
      createdById: userId,
    })
    return { brand: created }
  }

  // Find seller brand (user)
  async findSellerBrand(userId: number, brandId: number) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    const brand = await this.productsRepository.findBrandById(brandId)
    if (!brand || brand.sellerId !== seller.id)
      throw new AppError(ErrorCode.NOT_FOUND, 'Brand not found')
    return { brand }
  }

  // Update seller brand (user)
  @Transactional()
  async updateBrand(userId: number, brandId: number, data: Partial<Brand>) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    const existing = await this.productsRepository.findBrandById(brandId)
    if (!existing || existing.sellerId !== seller.id)
      throw new AppError(ErrorCode.NOT_FOUND, 'Brand not found')
    if (data.name) {
      const existingBrandName = await this.productsRepository.findBrandByName(data.name)
      if (existingBrandName)
        throw new AppError(ErrorCode.INVALID_STATE, 'Brand name already exists')
      await this.productsRepository.updateProductByBrandName(existing.name, {
        brandName: data.name,
      })
      await this.productsRepository.updateBrandAuthorizationByBrandName(existing.name, {
        brandName: data.name,
      })
    }
    await this.productsRepository.updateBrand(brandId, data)
    const updated = await this.productsRepository.findBrandById(brandId)
    return { brand: updated }
  }

  // Request brand authorization (user)
  async createBrandAuthorization(userId: number, data: CreateBrandAuthorizationDto) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    const existing = await this.productsRepository.findSellerBrandAuthorization(
      seller.id,
      data.brandName,
    )
    if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Brand authorization already exists')
    const created = await this.productsRepository.createBrandAuthorization({
      ...data,
      sellerId: seller.id,
    })
    return { brandAuthorization: created }
  }

  // Find all brand authorizations request (admin)
  async findAllBrandAuthorizations(query: FindBrandAuthorizationsDto) {
    return await this.productsRepository.findAllBrandAuthorizations(query)
  }

  // Find all brand authorizations request for a seller (user)
  async findSellerBrandAuthorizations(userId: number, query: FindBrandAuthorizationsDto) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    query.sellerId = seller.id
    return await this.productsRepository.findAllBrandAuthorizations(query)
  }

  // Find single brand authorization request (admin)
  async findBrandAuthorizationById(brandAuthorizationId: number) {
    const brandAuthorization =
      await this.productsRepository.findBrandAuthorizationById(brandAuthorizationId)
    if (!brandAuthorization)
      throw new AppError(ErrorCode.NOT_FOUND, 'Brand authorization not found')
    return { brandAuthorization }
  }

  // Find single brand authorization request for seller (user)
  async findSellerBrandAuthorizationById(userId: number, brandAuthorizationId: number) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    const brandAuthorization =
      await this.productsRepository.findBrandAuthorizationById(brandAuthorizationId)
    if (!brandAuthorization || brandAuthorization.sellerId !== seller.id)
      throw new AppError(ErrorCode.NOT_FOUND, 'Brand authorization not found')
    return { brandAuthorization }
  }

  // Update brand authorization request (admin)
  async updateBrandAuthorization(brandAuthorizationId: number, data: Partial<BrandAuthorization>) {
    const existing = await this.productsRepository.findBrandAuthorizationById(brandAuthorizationId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Brand authorization not found')
    await this.productsRepository.updateBrandAuthorization(brandAuthorizationId, data)
    const updated = await this.productsRepository.findBrandAuthorizationById(brandAuthorizationId)
    return { brandAuthorization: updated }
  }

  // Create seller product (user)
  async createProduct(userId: number, data: CreateProductDto) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    if (seller.isSuspended) throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Seller suspended')
    const country = await this.countriesRepository.findCountryById(data.countryId)
    if (!country) throw new AppError(ErrorCode.NOT_FOUND, 'Country not found')
    const brand = await this.productsRepository.findBrandByName(data.brandName)
    if (!brand) throw new AppError(ErrorCode.NOT_FOUND, 'Brand not found')
    if (brand.sellerId !== null && brand.sellerId !== seller.id)
      throw new AppError(ErrorCode.INVALID_STATE, 'Brand belongs to another seller')
    if (brand.isActive === false) throw new AppError(ErrorCode.INVALID_STATE, 'Brand is inactive')
    if (brand.isRestricted) {
      const brandAuthorization = await this.productsRepository.findSellerBrandAuthorization(
        seller.id,
        data.brandName,
      )
      if (!brandAuthorization)
        throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Brand usage requires authorization')
      if (brandAuthorization.isAuthorized === false)
        throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Brand authorization is inactive')
    }
    const category = await this.productsRepository.findCategoryById(data.categoryId)
    if (!category) throw new AppError(ErrorCode.NOT_FOUND, 'Category not found')
    if (category.isActive === false)
      throw new AppError(ErrorCode.INVALID_STATE, 'Category is inactive')
    let priority = 0
    if (seller.premiumTier === PremiumTier.Silver) priority = ProductPriority.Low
    if (seller.premiumTier === PremiumTier.Gold) priority = ProductPriority.Medium
    if (seller.premiumTier === PremiumTier.Diamond) priority = ProductPriority.High
    const created = await this.productsRepository.createProduct({
      sellerId: seller.id,
      ...data,
      priority,
      isSellerVerified: seller.isVerified,
      createdById: userId,
    })
    return { product: created }
  }

  // Find seller products (user)
  async findAllProducts(userId: number, query: FindProductsDto) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    query.sellerId = seller.id
    query.isDeleted = false
    return await this.productsRepository.findAllProducts(query)
  }

  // Find one product for seller (user)
  async findOneProduct(userId: number, productId: number) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    const product = await this.productsRepository.findProductById(productId)
    if (!product || product.sellerId !== seller.id)
      throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    return { product }
  }

  // Update seller product (user)
  async updateProduct(userId: number, productId: number, data: Partial<Product>) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    if (seller.isSuspended) throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Seller suspended')
    const existing = await this.productsRepository.findProductById(productId)
    if (!existing || existing.sellerId !== seller.id)
      throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    if (data.countryId) {
      const country = await this.countriesRepository.findCountryById(data.countryId)
      if (!country) throw new AppError(ErrorCode.NOT_FOUND, 'Country not found')
    }
    if (data.brandName) {
      const brand = await this.productsRepository.findBrandByName(data.brandName)
      if (!brand) throw new AppError(ErrorCode.NOT_FOUND, 'Brand not found')
      if (brand.sellerId !== null && brand.sellerId !== seller.id)
        throw new AppError(ErrorCode.INVALID_STATE, 'Brand belongs to another seller')
      if (brand.isActive === false) throw new AppError(ErrorCode.INVALID_STATE, 'Brand is inactive')
      if (brand.isRestricted) {
        const brandAuthorization = await this.productsRepository.findSellerBrandAuthorization(
          seller.id,
          data.brandName,
        )
        if (!brandAuthorization)
          throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Brand usage requires authorization')
        if (brandAuthorization.isAuthorized === false)
          throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Brand authorization is inactive')
      }
    }
    if (data.categoryId) {
      const category = await this.productsRepository.findCategoryById(data.categoryId)
      if (!category) throw new AppError(ErrorCode.NOT_FOUND, 'Category not found')
      if (category.isActive === false)
        throw new AppError(ErrorCode.INVALID_STATE, 'Category is inactive')
    }
    await this.productsRepository.updateProduct(productId, data)
    const updated = await this.productsRepository.findProductById(productId)
    return { product: updated }
  }

  // Create seller product image (user)
  async createProductImage(userId: number, productId: number, data: CreateProductImageDto) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    const product = await this.productsRepository.findProductById(productId)
    if (!product || product.sellerId !== seller.id)
      throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    if (data.isPrimary) await this.productsRepository.clearPrimaryImage(productId)
    const created = await this.productsRepository.createProductImage({
      ...data,
      productId,
      sellerId: seller.id,
      createdById: userId,
    })
    return { productImage: created }
  }

  // Update seller product image (user)
  async updateProductImage(userId: number, productImageId: number, data: Partial<ProductImage>) {
    const seller = await this.sellersRepository.findSellerByUserId(userId)
    if (!seller) throw new AppError(ErrorCode.NOT_FOUND, 'Seller not found')
    const existing = await this.productsRepository.findProductImageById(productImageId)
    if (!existing || existing.sellerId !== seller.id)
      throw new AppError(ErrorCode.NOT_FOUND, 'Product image not found')
    if (data.isPrimary) await this.productsRepository.clearPrimaryImage(existing.productId)
    await this.productsRepository.updateProductImage(productImageId, data)
    const updated = await this.productsRepository.findProductImageById(productImageId)
    return { productImage: updated }
  }
}
