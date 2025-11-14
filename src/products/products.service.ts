import { Injectable } from '@nestjs/common'
import { ProductsRepository } from './products.repository'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'
import { FindProductsDto } from './dto/find-products.dto'
import { FindBrandsDto } from './dto/find-brands.dto'
import { Product, ProductPriority } from './entities/product.entity'
import { ProductImage } from './entities/product-image.entity'
import { Brand } from './entities/brand.entity'
import { Category } from './entities/category.entity'
import { SortBy } from 'src/common/enums/sort-by.enum'

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  // Create product (admin)
  async createProduct(data: Partial<Product>, adminId: number) {
    const created = await this.productsRepository.createProduct({
      ...data,
      priority: ProductPriority.High,
      createdById: adminId,
    })
    return { product: created }
  }

  // Find all products (admin)
  async findAllProductsForAdmin(query: FindProductsDto) {
    return await this.productsRepository.findAllProducts(query)
  }

  // Find all products (user)
  async findAllProducts(query: FindProductsDto) {
    query.isDeleted = false
    query.sortBy = SortBy.Priority
    return await this.productsRepository.findAllProducts(query)
  }

  // Find one product (admin)
  async findOneProductForAdmin(productId: number) {
    const product = await this.productsRepository.findProductById(productId)
    if (!product) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    return { product }
  }

  // Find one product (user)
  async findOneProduct(productId: number) {
    const product = await this.productsRepository.findProductById(productId)
    if (!product || product.isDeleted) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    return { product }
  }

  // Update product (admin)
  async updateProduct(productId: number, data: Partial<Product>) {
    const existing = await this.productsRepository.findProductById(productId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    await this.productsRepository.updateProduct(productId, data)
    const updated = await this.productsRepository.findProductById(productId)
    return { product: updated }
  }

  // Create product image (admin)
  async createProductImage(adminId: number, productId: number, data: Partial<ProductImage>) {
    const product = await this.productsRepository.findProductById(productId)
    if (!product) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    if (data.isPrimary) await this.productsRepository.clearPrimaryImage(productId)
    const created = await this.productsRepository.createProductImage({
      ...data,
      productId,
      createdById: adminId,
    })
    return { productImage: created }
  }

  // Find all product images (both)
  async findProductImages(productId: number) {
    const productImages = await this.productsRepository.findProductImages(productId)
    return { productImages }
  }

  // Find one product image (both)
  async findOneProductImage(productImageId: number) {
    const productImage = await this.productsRepository.findProductImageById(productImageId)
    if (!productImage) throw new AppError(ErrorCode.NOT_FOUND, 'Product image not found')
    return { productImage }
  }

  // Update product image (admin)
  async updateProductImage(productImageId: number, data: Partial<ProductImage>) {
    const existing = await this.productsRepository.findProductImageById(productImageId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Product image not found')
    if (data.isPrimary) await this.productsRepository.clearPrimaryImage(existing.productId)
    await this.productsRepository.updateProductImage(productImageId, data)
    const updated = await this.productsRepository.findProductImageById(productImageId)
    return { productImage: updated }
  }

  // Create brand (admin)
  async createBrand(adminId: number, data: Partial<Brand>) {
    if (!data.name) throw new AppError(ErrorCode.VALIDATION_ERROR, 'Brand name is required')
    const existing = await this.productsRepository.findBrandByName(data.name)
    if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Brand name already exists')
    const created = await this.productsRepository.createBrand({
      ...data,
      createdById: adminId,
    })
    return { brand: created }
  }

  // Find all brands (admin)
  async findAllBrands(query: FindBrandsDto) {
    return await this.productsRepository.findAllBrands(query)
  }

  // Find one brand (admin)
  async findOneBrand(brandId: number) {
    const brand = await this.productsRepository.findBrandById(brandId)
    if (!brand) throw new AppError(ErrorCode.NOT_FOUND, 'Brand not found')
    return { brand }
  }

  // Update brand (admin)
  async updateBrand(brandId: number, data: Partial<Brand>) {
    const existing = await this.productsRepository.findBrandById(brandId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Brand not found')
    await this.productsRepository.updateBrand(brandId, data)
    const updated = await this.productsRepository.findBrandById(brandId)
    return { brand: updated }
  }

  // Create category (admin)
  async createCategory(adminId: number, data: Partial<Category>) {
    const created = await this.productsRepository.createCategory({
      ...data,
      createdById: adminId,
    })
    return { category: created }
  }

  // Find categories tree (both)
  async findCategoriesTree() {
    const categories = await this.productsRepository.findCategoriesTree()
    return { categories }
  }

  // Find one category (admin)
  async findOneCategory(categoryId: number) {
    const category = await this.productsRepository.findCategoryById(categoryId)
    if (!category) throw new AppError(ErrorCode.NOT_FOUND, 'Category not found')
    return { category }
  }

  // Update category (admin)
  async updateCategory(categoryId: number, data: Partial<Category>) {
    const existing = await this.productsRepository.findCategoryById(categoryId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Category not found')
    await this.productsRepository.updateCategory(categoryId, data)
    const updated = await this.productsRepository.findCategoryById(categoryId)
    return { category: updated }
  }
}
