import { and, asc, desc, sql } from 'drizzle-orm'
import { db } from 'src/drizzle/db'

export const paginate = async (
  modelQuery: any,
  table: any,
  whereConditions: any[],
  query: Record<string, any>,
  extras?: Record<string, any> // optional parameter
) => {
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const offset = (page - 1) * limit
  const sortOrder = query.orderBy === 'asc' ? asc : desc

  const where =
    whereConditions.length > 1
      ? and(...whereConditions)
      : whereConditions[0] ?? undefined

  const [items, [{ totalCount }]] = await Promise.all([
    modelQuery.findMany({
      where,
      orderBy: [sortOrder(table.createdAt)],
      ...(extras ? extras : {}), // only include extras if passed
      limit,
      offset,
    }),
    db.select({ totalCount: sql<number>`count(*)` }).from(table).where(where),
  ])

  const count = items.length
  const total = Number(totalCount)
  const totalPages = Math.ceil(total / limit)

  return {
    items,
    meta: {
      pagination: { page, limit, count, total, totalPages },
    },
  }
}



/*import { and, asc, desc, sql } from 'drizzle-orm'
import { db } from 'src/drizzle/db'

export const paginate = async (
  modelQuery: any,
  table: any, whereConditions: any[],
  query: Record<string, any>,
) => {
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const offset = (page - 1) * limit
  const sortOrder = query.orderBy === 'asc' ? asc : desc
  const where =
    whereConditions.length > 1
      ? and(...whereConditions)
      : whereConditions[0] ?? undefined

  const [items, [{ totalCount }]] = await Promise.all([
    modelQuery.findMany({
      where,
      orderBy: [sortOrder(table.createdAt)],
      limit,
      offset,
    }),
    db.select({ totalCount: sql<number>`count(*)` }).from(table).where(where),
  ])
  
  const count = items.length
  const total = Number(totalCount)
  const totalPages = Math.ceil(total / limit)

  return {
    items,
    meta: {
      pagination: { page, limit, count, total, totalPages },
    },
  }
}*/