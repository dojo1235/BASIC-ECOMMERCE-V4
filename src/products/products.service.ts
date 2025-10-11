import { Injectable, HttpStatus } from '@nestjs/common'
import { db } from 'src/drizzle/db'
import { products } from 'src/drizzle/schema'
import { and, or, eq, ilike, gte, lte } from 'drizzle-orm'
import { paginate } from 'src/common/utils/pagination.util'
import { AppError } from 'src/common/errors/app-error'

@Injectable()
export class ProductsService {
  // Create product (admin)
  async createProduct(createProductDto: any, adminId: number) {
    const [created] = await db.insert(products)
      .values({
        ...createProductDto,
        createdBy: adminId,
      })
      .returning() as any[]
    return { product: created }
  }

  // Find all products (admin)
  async findAllProductsForAdmin(query: Record<string, any>) {
    const { search, status, minPrice, maxPrice, isDeleted } = query
    const whereConditions: any[] = []
    if (search) {
      whereConditions.push(
        or(ilike(products.name, `%${search}%`), ilike(products.description, `%${search}%`)),
      )
    }
    if (status) whereConditions.push(eq(products.status, status))
    if (minPrice) whereConditions.push(gte(products.price, Number(minPrice)))
    if (maxPrice) whereConditions.push(lte(products.price, Number(maxPrice)))
    if ('isDeleted' in query) whereConditions.push(eq(products.isDeleted, query.isDeleted === 'true'))
    const result = await paginate(db.query.products, products, whereConditions, query)
    return { products: result.items, meta: result.meta }
  }

  // Find all products (user)
  async findAllProductsForUser(query: Record<string, any>) {
    const { search, minPrice, maxPrice } = query
    const whereConditions: any[] = [eq(products.isDeleted, false)]
    if (search) {
      whereConditions.push(
        or(ilike(products.name, `%${search}%`), ilike(products.description, `%${search}%`)),
      )
    }
    if (minPrice) whereConditions.push(gte(products.price, Number(minPrice)))
    if (maxPrice) whereConditions.push(lte(products.price, Number(maxPrice)))
    const result = await paginate(db.query.products, products, whereConditions, query)
    return { products: result.items, meta: result.meta }
  }

  // Find one product (admin)
  async findOneProductForAdmin(id: number) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    })
    if (!product) throw new AppError('Product not found', HttpStatus.NOT_FOUND)
    return { product }
  }

  // Find one product (user)
  async findOneProductForUser(id: number) {
    const product = await db.query.products.findFirst({
      where: and(eq(products.id, id), eq(products.isDeleted, false)),
    })
    if (!product) throw new AppError('Product not found', HttpStatus.NOT_FOUND)
    return { product }
  }

  // Update product (admin)
  async updateProduct(id: number, dto: any) {
    const existing = await db.query.products.findFirst({
      where: eq(products.id, id),
    })
    if (!existing) throw new AppError('Product not found', HttpStatus.NOT_FOUND)
    const [updated] = await db.update(products)
      .set(dto)
      .where(eq(products.id, id))
      .returning() as any[]
    return { product: updated }
  }
}